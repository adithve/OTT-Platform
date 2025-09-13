from rest_framework import serializers
from adminapp.models import Movies
from adminapp.models import WatchHistory
from adminapp.models import WatchLater

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movies
        fields = '__all__'

class WatchLaterSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)   

    class Meta:
        model = WatchLater
        fields = ['id', 'movie']   

class WatchHistorySerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)  
    class Meta:
        model = WatchHistory
        fields = ['id', 'movie', 'watched_at']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)