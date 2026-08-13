from django.shortcuts import render

# Create your views here.

def home (request):
    return render (request, 'core/index.html')


def about(request):
    return render(request, 'core/about.html')

def contact(request):
    return render(request, 'core/contact.html')

def why(request):
    return render(request, 'core/why.html')

def testimonial(request):
    return render(request, 'core/testimonial.html')