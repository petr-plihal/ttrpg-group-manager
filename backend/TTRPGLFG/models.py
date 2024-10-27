# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order (DONE)
#   * Make sure each model has one field with primary_key=True (I hope this is done automatically)
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior (DONE)
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table (DONE)
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class User(models.Model):
    username = models.CharField(unique=True, max_length=30)
    profilepicture = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=600, blank=True, null=True)
    candm = models.BooleanField(blank=True, null=True)

    class Meta:
        db_table = 'user'


class Game(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=600)

    class Meta:
        db_table = 'game'


class Group(models.Model):
    name = models.CharField(unique=True, max_length=50)
    description = models.CharField(max_length=600, blank=True, null=True)
    location = models.CharField(max_length=45)
    isopen = models.BooleanField()
    languages = models.CharField(max_length=45, blank=True, null=True)
    maxsize = models.IntegerField()
    dmneeded = models.BooleanField()
    gameid = models.ForeignKey(Game, models.DO_NOTHING, db_column='gameid')
    groupchatcontent = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'group'


class Application(models.Model):
    applicantid = models.ForeignKey('User', models.CASCADE, db_column='applicantid')
    groupid = models.ForeignKey('Group', models.CASCADE, db_column='groupid')
    description = models.CharField(max_length=600, blank=True, null=True)
    appchatcontent = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'application'


class Belongsto(models.Model):
    userid = models.ForeignKey('User', models.CASCADE, db_column='userid')
    groupid = models.ForeignKey('Group', models.CASCADE, db_column='groupid')
    isowner = models.BooleanField()
    nickname = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        db_table = 'belongsto'


class Tag(models.Model):
    name = models.CharField(unique=True, max_length=45)

    class Meta:
        db_table = 'tag'


class Grouptag(models.Model):
    groupid = models.ForeignKey(Group, models.CASCADE, db_column='groupid')
    tagid = models.ForeignKey('Tag', models.CASCADE, db_column='tagid')

    class Meta:
        db_table = 'grouptag'


class Schedule(models.Model):
    userid = models.ForeignKey('User', models.CASCADE, db_column='userid')
    day = models.CharField(max_length=2)
    starttime = models.TimeField()
    endtime = models.TimeField()

    class Meta:
        db_table = 'schedule'


class Session(models.Model):
    groupid = models.ForeignKey(Group, models.CASCADE, db_column='groupid')
    num = models.IntegerField(blank=True, null=True)
    description = models.CharField(max_length=600, blank=True, null=True)
    starttime = models.DateTimeField()
    duration = models.IntegerField()

    class Meta:
        db_table = 'session'


class Usertag(models.Model):
    userid = models.ForeignKey(User, models.CASCADE, db_column='userid')
    tagid = models.ForeignKey(Tag, models.CASCADE, db_column='tagid')
    islooking = models.BooleanField()

    class Meta:
        db_table = 'usertag'
