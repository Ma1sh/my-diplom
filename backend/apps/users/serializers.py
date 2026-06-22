from rest_framework import serializers
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from .models import User


class UserCreateSerializer(BaseUserCreateSerializer):
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    re_password = serializers.CharField(style={"input_type": "password"}, write_only=True)

    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone', 'password', 're_password')

    def validate_phone(self, value):
        if value and len(value) < 10:
            raise serializers.ValidationError("Телефон слишком короткий")
        return value

    def validate(self, attrs):

        re_password = attrs.pop('re_password', None)
        password = attrs.get('password')


        if password != re_password:
            raise serializers.ValidationError({"re_password": ["Пароли не совпадают."]})

        attrs = super().validate(attrs)

        return attrs


class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone', 'avatar', 'created_at')