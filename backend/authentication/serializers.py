from rest_framework import serializers

from .models import User, Patient


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = (
            'id', 'email', 'date_created', 'date_modified',
            'firstname', 'lastname', 'date_of_birth', 'password', 'confirm_password')
        read_only_fields = ('date_created', 'date_modified')

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.firstname = validated_data.get('firstname',
                                                instance.firstname)
        instance.lastname = validated_data.get('lastname',
                                               instance.lastname)

        password = validated_data.get('password', None)
        confirm_password = validated_data.get('confirm_password', None)

        if password and password == confirm_password:
            instance.set_password(password)

        instance.save()
        return instance

    def validate(self, data):
        if data['password']:
            if data['password'] != data['confirm_password']:
                raise serializers.ValidationError(
                    "The passwords have to be the same"
                )
        return data


class PatientSerializer(serializers.ModelSerializer):
    carers = UserSerializer(many=True, allow_null=True)

    class Meta:
        model = Patient
        fields = ('firstname', 'lastname', 'gender', 'date_created', 'date_modified', 'date_of_birth', 'carers')
        extra_kwargs = {'carers': {'allow_null': 'True'}}

    def create(self, validated_data):
        Patient.objects.create(**validated_data)
        # Patient.carers.add(self.context['request'].user)
        Patient.save()
        return Patient

