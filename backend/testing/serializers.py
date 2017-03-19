from rest_framework import serializers
from testing.models import Test

class TestSerializer(serializers.Serializer):
        message = serializers.CharField(required=False, allow_blank=True, max_length=100)

        def create(self, validated_data):
            return Test.objects.create(**validated_data)

        class Meta:
            model = Test
            fields = 'message'
