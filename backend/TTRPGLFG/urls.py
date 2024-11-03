from django.urls import re_path

from . import views

urlpatterns = [
    re_path("^user/?$", views.createUser, name="createUser"),
    re_path("^dmusers/?$", views.getDMUsers, name="getDMUsers"),
    re_path("^group/?$", views.createGroup, name="createGroup"),
    re_path("^group/(?P<game>\\d+)/?$", views.getGroupByGame, name="getGroupByGame"),
    re_path("^group/(?P<languages>\\w+)/?$", views.getGroupByLanguage, name="getGroupByLanguage"),
    re_path("^groupnodm/?$", views.getGroupWithoutDM, name="getGroupWithoutDM"),
    re_path("^game/?$", views.createGame, name="createGame"),
    re_path("^denyApplication/(?P<application_id>\\d+)/?$", views.denyApplication, name="denyApplication"),
    re_path("^acceptApplication/(?P<application_id>\\d+)/?$", views.acceptApplication, name="acceptApplication"),
]
