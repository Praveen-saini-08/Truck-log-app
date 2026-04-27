from rest_framework import serializers
from .models import TripRequest


class TripRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripRequest
        fields = "__all__"