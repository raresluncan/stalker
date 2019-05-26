def is_super_admin(user):
    """ checks if a user is an admin.IF not, returns False, otherwise True """
    if not hasattr(user, 'is_super_admin'):
        return False
    return user.is_super_admin == True