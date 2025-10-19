from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class UserCreateSerializer(serializers.ModelSerializer):
    is_staff = serializers.BooleanField(required=False, default=False)
    is_superuser = serializers.BooleanField(required=False, default=False)
    
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'is_staff',
            'is_superuser',
        ]
        
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        is_staff = validated_data.pop('is_staff', False)
        is_superuser = validated_data.pop('is_superuser', False)
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password'],
            is_staff=is_staff,
            is_superuser=is_superuser
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_staff',
            'is_superuser',
            'is_active',
            'date_joined'
        ]
        
        read_only_fields = [
            'id',
            'is_staff',
            'is_superuser',
            'is_active',
            'date_joined'
        ]

class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=False,
        validators=[validate_password]
    )
    
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name', 
            'last_name',
            'password',
            'is_staff',
            'is_superuser',
            'is_active'
        ]
        
    def validate_password(self, value):
        if value and value.strip():
            validate_password(value)
        return value
        
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if password and password.strip():
            instance.set_password(password)
        
        instance.save()
        return instance

# serializer for staff users updating their own account
class UserSelfUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=False,
        validators=[validate_password]
    )
    
    class Meta:
        model = User
        fields = [
            'email',
            'first_name', 
            'last_name',
            'password'
        ]
        
    def validate_password(self, value):
        if value and value.strip():
            validate_password(value)
        return value
        
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password and password.strip():
            instance.set_password(password)
        
        instance.save()
        return instance