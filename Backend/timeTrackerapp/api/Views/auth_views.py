from rest_framework import mixins, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from timeTrackerapp.Serializers.Authentication.Serializers import \
    LoginSerializer, \
    RegisterSerializer, \
    UpdateUserSerializer, \
    ChangePasswordSerializer, \
    UserSerializer
from timeTrackerapp.models import MyUser
from timeTrackerapp.api.Permission.permissions import IsSuperAdmin, IsSameUser
from rest_condition import Or




class Login(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(validated_data=request.data)

            return Response(serializer.data, status=200)
        # internal server error response
        return Response(serializer.errors, status=400)


#create a new user object
class Register(APIView):
    permission_classes = [IsSuperAdmin]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if (serializer).is_valid():
            # serializer.create(validated_data=request.data)
            serializer.save()
            return Response(serializer.data, status=201)
            # internal server error response
        return Response(serializer.errors, status=400)


#edit user ( only for super admin and user himself )
class UpdateDestroyUser(
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    queryset = MyUser.objects.all()
    serializer_class = UpdateUserSerializer

    permission_classes = [Or(IsSameUser,IsSuperAdmin)]



    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def getPk(self):
        return self.kwargs['pk']

#Change password of user using the old passsword
class ChangePassword(APIView):

    def post(self,request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data , status=202)
        return Response(serializer.errors, status=400)


#list of users to be viewed by the superadmin
class UserList(mixins.ListModelMixin
                ,generics.GenericAPIView):

    queryset = MyUser.objects.all().order_by('-id')
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)




    #todo : implememnt the forgot password fucionality if asked for it