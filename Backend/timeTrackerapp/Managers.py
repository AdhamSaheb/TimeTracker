from django.contrib.auth.base_user import BaseUserManager




class CustomUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password,roles, **extra_fields):
        """
        Create and save a user with the given username, email,roles, and password
        """
        if not email:
            raise ValueError('The email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email,roles=roles, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        roles = ['superadmin']

        return self._create_user(email, password, roles ,**extra_fields)



