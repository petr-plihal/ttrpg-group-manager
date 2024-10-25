from django.contrib import admin

# Register your models here.
from .models import User, Game, Group, Application, Belongsto, Tag, Grouptag, Schedule, Session

admin.site.register(User)
admin.site.register(Game)
admin.site.register(Group)
admin.site.register(Application)
admin.site.register(Belongsto)
admin.site.register(Tag)
admin.site.register(Grouptag)
admin.site.register(Schedule)
admin.site.register(Session)
