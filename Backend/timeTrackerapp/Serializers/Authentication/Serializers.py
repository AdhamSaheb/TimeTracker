from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from timeTrackerapp.models import MyUser


# serializer used to login
class LoginSerializer(serializers.Serializer):

    email=serializers.EmailField()
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    roles = serializers.CharField(read_only=True)
    token = serializers.CharField(max_length=255, read_only=True)
    id =serializers.IntegerField(read_only=True)

    def save(self, validated_data):
        email = validated_data.get("email", None)
        password = validated_data.get("password", None)
        # Now we authenticate the user
        user = MyUser.objects.get(email=email)

        if user is not None:
            user = authenticate(email=user.email, password=password)
        # this will return None if user in not authenticated
        # if it returned a value
        if user is not None:
            if user.is_active:  # if it's not banned/deleted ....
                # token = Token.objects.get_or_create(user=user)
                # validated_data['token'] = token[0]
                return validated_data
        raise serializers.ValidationError({'error': 'email or password is incorrect ! '})


    def validate(self, data):
        try:
            temp_user = MyUser.objects.get(email=data.get('email', None))
            token = Token.objects.get_or_create(user=temp_user)
            data['first_name'] = temp_user.first_name
            data['last_name'] = temp_user.last_name
            data['username'] = temp_user.username
            data['roles'] = temp_user.roles
            data['token'] = token[0]
            data['id'] = temp_user.id
            return data
        except MyUser.DoesNotExist:
            raise serializers.ValidationError({'email': 'email does not exist'})




#serializer user in sign up
#confirmation of password will be done on the front end side
class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = MyUser
        fields = ['email','password','username','first_name','last_name','roles','id']
        extra_kwargs = {
            'first_name' : {'required' : True},
            'last_name' : {'required' : True},
            'roles' : {'required' : True},
            'password' : {'write_only' : True},
            'id': {'read_only' : True},
        }

    def create(self, validated_data):
        try:
            temp_user = MyUser.objects.get(email=validated_data['email'])
        except MyUser.DoesNotExist:
            user = MyUser(
                username=validated_data['username'],
                email=validated_data['email']
            )
            password = validated_data['password']
            user.set_password(password)
            user.first_name=validated_data.get('first_name')
            user.last_name=validated_data.get('last_name')
            user.roles=validated_data.get('roles')
            if( "superadmin" in user.roles):
                user.is_superuser = True
            user.save()
            return  user


        else:
            raise serializers.ValidationError({'email': 'email already exists'})



#  to edit user
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['email', 'username','first_name','last_name','roles']
        extra_kwargs = {
            'first_name' : {'required' : False},
            'last_name' : {'required' : False},
            'roles' : {'required' : False},
            'username' : {'required' : False},
        }

    def update(self, instance, validated_data):
        if validated_data['roles'] == "superadmin":
            instance.is_superuser = True
        else : instance.is_superuser = False
        return super().update(instance, validated_data)

#Representation of user
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['email', 'username','first_name','last_name','roles','id']




#change password using the old password
class ChangePasswordSerializer(serializers.Serializer):
        email = serializers.EmailField(write_only=True)
        password = serializers.CharField(write_only=True,style={'input_type' : 'password'},trim_whitespace=False)
        newPassword = serializers.CharField()

        def save(self):
            try:
                temp_user = MyUser.objects.get(email=self.validated_data['email'])
            except MyUser.DoesNotExist:
                raise serializers.ValidationError({'email': 'User Not Found ! '})
            else:
                email = self.validated_data['email']
                password = self.validated_data['password']
                newPassword = self.validated_data['newPassword']
                user = authenticate(email= email,password= password)
                if user is not None:
                    user.set_password(newPassword)
                    user.save()

                else :
                    raise serializers.ValidationError({'Authentication' : 'Authentication Failed !'})


