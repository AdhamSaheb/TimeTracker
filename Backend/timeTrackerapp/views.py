from django.shortcuts import render




#index view to test the server
def index(request):
    # View code here...
    return render(request, 'timeTrackerapp/index.html')






