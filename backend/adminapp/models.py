from django.contrib.auth.models import AbstractBaseUser,BaseUserManager 
from django.db import models 


class UserManager(BaseUserManager): 
    def create_user(self, email, password=None): 
        if not email: 
            raise ValueError("Users must have an email address") 
        email = self.normalize_email(email) 
        user = self.model(email=email) 
        user.set_password(password) 
        user.save(using=self._db) 
        return user 
 
    def create_superuser(self, email, password): 
        user = self.create_user(email, password) 
        user.is_admin = True 
        User.is_superuser = True 
        user.save(using=self._db) 
        return user 
 
class User(AbstractBaseUser): 
    email = models.EmailField(unique=True) 
    name = models.CharField(max_length =255) 
    is_active = models.BooleanField(default=True) 
    is_admin = models.BooleanField(default=False) 
    objects = UserManager() 
 
    USERNAME_FIELD = 'email'
 
class Movies(models.Model):
    title = models.CharField(max_length=100)
    thumbnail = models.FileField(upload_to='thumbnails/')
    language = models.CharField(max_length=100)
    description = models.TextField(null=True)
    video = models.FileField(upload_to='videos/')
    count = models.IntegerField(default=0)

class WatchLater(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    movie = models.ForeignKey(Movies,on_delete=models.CASCADE)

class WatchHistory(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    movie = models.ForeignKey(Movies,on_delete=models.CASCADE)
    watched_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = ("user", "movie")
