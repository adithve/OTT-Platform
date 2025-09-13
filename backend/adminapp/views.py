from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, get_user_model, login,logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_403_FORBIDDEN
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from django.utils import timezone
from .models import Movies, User, WatchHistory, WatchLater
from adminapp.models import Movies
from django.contrib import messages
from .serializers import MovieSerializer, WatchHistorySerializer, ChangePasswordSerializer, WatchLaterSerializer

# Admin Views 

def adminlogin(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        user = authenticate(request, email=email, password=password)

        if user is not None and getattr(user, "is_admin", False):
            login(request, user)
            return redirect("adminhome")
        else:
            messages.error(request, "Invalid email or password!")

    return render(request, "adminlogin.html")

@login_required(login_url="adminlogin")
def adminhome(request):
    query = request.GET.get("q")
    if query:
        movies = Movies.objects.filter(title__icontains=query)
    else:
        movies = Movies.objects.all()

    return render(request, "adminapp/adminhome.html", {"movies": movies})

@login_required(login_url="adminlogin")
def admaddmovie(request):
    if request.method == "POST":
        title = request.POST.get("title")
        language = request.POST.get("language")
        description = request.POST.get("description")
        thumbnail = request.FILES.get("thumbnail")
        video = request.FILES.get("video")

        if title and thumbnail and video:
            Movies.objects.create(
                title=title,
                language=language,
                description=description,
                thumbnail=thumbnail,
                video=video
            )
            messages.success(request, "Movie added successfully!")
            return redirect("adminhome")
        else:
            messages.error(request, "Please fill all required fields")

    return render(request, "adminapp/admaddmovie.html")

@login_required(login_url="adminlogin")
def admeditmovie(request, pk):
    movie = get_object_or_404(Movies, id=pk)

    if request.method == "POST":
        title = request.POST.get("title")
        language = request.POST.get("language")
        description = request.POST.get("description")

        movie.title = title
        movie.language = language
        movie.description = description

        if request.FILES.get("thumbnail"):
            movie.thumbnail = request.FILES["thumbnail"]
        if request.FILES.get("video"):
            movie.video = request.FILES["video"]

        movie.save()
        messages.success(request, "Movie updated successfully!")
        return redirect("adminhome")

    return render(request, "adminapp/admeditmovie.html", {"movie": movie})

@login_required(login_url="adminlogin")
def admdeletemovie(request, pk):
    movie = get_object_or_404(Movies, pk=pk)
    movie.delete()
    messages.success(request, f"Movie '{movie.title}' deleted successfully!")
    return redirect("adminhome")

@login_required(login_url="adminlogin")
def admmovie(request, pk):
    movie = get_object_or_404(Movies, id=pk)
    return render(request, "adminapp/admmovie.html", {"movie": movie})


@login_required(login_url="adminlogin")
def admchangepassword(request):
    if request.method == "POST":
        old_password = request.POST.get("old_password")
        new_password = request.POST.get("new_password")
        confirm_password = request.POST.get("confirm_password")

        if not request.user.check_password(old_password):
            messages.error(request, "Old password is incorrect.")
            return redirect("admchangepass")

        if new_password != confirm_password:
            messages.error(request, "New password and confirm password do not match.")
            return redirect("admchangepass")

        request.user.set_password(new_password)
        request.user.save()

        messages.success(request, "Password updated successfully. Please login again.")

    return render(request, "adminapp/admchangepass.html")

@login_required(login_url="adminlogin")
def admlistuser(request):
    users = User.objects.filter(is_admin=False) 
    return render(request, "adminapp/admlistuser.html", {"users": users})

@login_required(login_url="adminlogin")
def admviewuser(request, pk):
    user = get_object_or_404(User, pk=pk, is_admin=False) 
    watch_history = WatchHistory.objects.filter(user=user).select_related("movie").order_by("-watched_at")

    context = {
        "user": user,
        "watch_history": watch_history,
    }
    return render(request, "admuserview.html", context)

@login_required(login_url="adminlogin")
def admblockuser(request, pk):
    user = get_object_or_404(User, id=pk, is_admin=False)

    if request.method == "POST":
        action = request.POST.get("status")
        if action == "block":
            user.is_active = False
            user.save()
        elif action == "unblock":
            user.is_active = True
            user.save()
        else:
            messages.error(request, "Invalid action.")

    return redirect("admlistuser") 

@login_required(login_url="adminlogin")
def admreport(request):
    movies = Movies.objects.all().order_by('-count')

    return render(request, "adminapp/admreport.html", {"movies": movies})

@login_required(login_url="adminlogin")
def admlogout(request):
    logout(request)  
    return render(request, "adminapp/adminlogout.html")


#User APIs 

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def Usersignup(request):
    email  = request.data.get("email")
    password = request.data.get("password")
    name = request.data.get("name")

    if not name or not email or not password:
        return Response({'message': 'All fields are required'}, status=HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'message': 'Email already exists'}, status=HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(email=email, password=password)
    user.name = name
    user.save()

    return Response({'message': 'User created successfully'}, status=201)

@api_view(['POST'])
@permission_classes([AllowAny])
def Userlogin(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if email is None or password is None:
        return Response({'error': 'Please provide email and password'},
                        status=HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid Credentials'}, status=HTTP_404_NOT_FOUND)
    
    if not user.is_active:
        return Response({'error': 'Your account has been blocked by admin.'},
                        status=HTTP_403_FORBIDDEN)

    user = authenticate(email=email, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'}, status=HTTP_404_NOT_FOUND)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key}, status=HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_movies(request):
    movies = Movies.objects.all()
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def movie_details(request, pk):
    movie = get_object_or_404(Movies, pk=pk)
    serializer = MovieSerializer(movie)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_watchlist(request, pk):
    user = request.user
    movie = get_object_or_404(Movies, pk=pk)

    if WatchLater.objects.filter(user=user, movie=movie).exists():
        return Response({"message": "Movie already in watchlist"}, status=400)

    WatchLater.objects.create(user=user, movie=movie)
    return Response({"message": "Movie added to watchlist"}, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_watchlist(request):
    watchlist_items = WatchLater.objects.filter(user=request.user).select_related('movie')
    serializer = WatchLaterSerializer(watchlist_items, many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_watchlist(request, pk):
    movie = get_object_or_404(Movies, pk=pk)
    watch_item = WatchLater.objects.filter(user=request.user, movie=movie).first()

    if watch_item:
        watch_item.delete()
        return Response({"message": "Movie removed from watchlist successfully"})
    else:
        return Response({"message": "Movie not found in your watchlist"}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_watch_history(request, pk):
    movie = get_object_or_404(Movies, pk=pk)
    
    history, created = WatchHistory.objects.update_or_create(
        user=request.user,
        movie=movie,
        defaults={'watched_at': timezone.now()}
    )

    if created:
        movie.count += 1
        movie.save(update_fields=["count"])
        msg = "Movie added to watch history"
    else:
        msg = "Movie watch time updated"

    serializer = WatchHistorySerializer(history)
    return Response({"message": msg, "data": serializer.data}, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_watch_history(request):
    history = WatchHistory.objects.filter(user=request.user).order_by('-watched_at')
    serializer = WatchHistorySerializer(history, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        user = request.user

        if not user.check_password(serializer.validated_data['old_password']):
            return Response({"error": "Old password is incorrect"}, status=HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({"message": "Password updated successfully"}, status=HTTP_200_OK)

    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
