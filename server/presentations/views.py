from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from presentations.models import Presentation

def index(request):
    pres_list = Presentation.objects.order_by('created_at')[:5]
    context = {'pres_list': pres_list}
    return render(request, 'presentations/index.html', context)

def detail(request, presentation_id):
    pres = get_object_or_404(Presentation, pk=presentation_id)
    return render(request, 'presentations/details.html', {'pres': pres})

def play(request, presentation_id):
    pres = get_object_or_404(Presentation, pk=presentation_id)
    return render(request, 'presentations/play.html', {'pres': pres})
    
def edit(request, presentation_id):
    pres = get_object_or_404(Presentation, pk=presentation_id)
    return render(request, 'presentations/edit.html', {'pres': pres})
