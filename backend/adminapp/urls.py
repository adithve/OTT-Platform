from django.urls import path
from . import views


urlpatterns = [
    path('', views.adminlogin, name="adminlogin"),
    path('Admin-Home/', views.adminhome, name="adminhome"),
    path('Admin-Add-Movie/', views.admaddmovie, name="admaddmovie"),
    path('Admin-Movie/<int:pk>/', views.admmovie, name="admmovie"),
    path('Admin-Edit-Movie/<int:pk>/', views.admeditmovie, name="admeditmovie"),
    path('Admin-Delete-Movie/<int:pk>/', views.admdeletemovie, name="admdeletemovie"),
    path('Admin-Change-Password/', views.admchangepassword, name="admchangepass"),
    path('Admin-List-User/', views.admlistuser, name="admlistuser"),
    path('Admin-View-User/<int:pk>/', views.admviewuser, name="admviewuser"),
    path('Admin-Block-User/<int:pk>/', views.admblockuser, name="admblockuser"),
    path('Admin-Report/', views.admreport, name="admreport"),
    path('admlogout/', views.admlogout, name='admlogout'),

    path('signup/', views.Usersignup, name="signup"),
    path('login/', views.Userlogin, name="login"),
    path('movie-list/', views.list_movies, name="movielist"),
    path('movie/<int:pk>/', views.movie_details, name="movie"),
    path('watchlist/add/<int:pk>/', views.add_to_watchlist, name="add_to_watchlist"),
    path('watchlist/', views.view_watchlist, name="view_watchlist"),
    path('watchlist/remove/<int:pk>/', views.remove_from_watchlist, name="remove_from_watchlist"),
    path('watch-history/add/<int:pk>/', views.add_to_watch_history, name="add_watch_history"),
    path('watch-history/', views.view_watch_history, name="watch_history"),
    path('change-password/', views.change_password, name="change_password"),
]
