import logging
import json
import sys

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse,HttpResponseRedirect
from presentations.models import Presentation
from presentations.forms import PresentationForm
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

logger = logging.getLogger(__name__)
hdlr = logging.StreamHandler()   # Logs to stderr by default
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
hdlr.setFormatter(formatter)
logger.addHandler(hdlr)
logger.setLevel(logging.DEBUG)
PRES_PATH = "/home/luca/Development/Crezy/server/static/presentations"

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

def save(request, presentation_id):
    if request.method == 'POST':
        try:
            json.loads(request.body)
            name = PRES_PATH+'/'+presentation_id+'.json'
            if (default_storage.exists(name)): default_storage.delete(name)
            path = default_storage.save(name, ContentFile(request.body))
            return HttpResponse(status=204)
        except ValueError:
            logger.debug("Bad JSON: "+request.body)
        except:
            logger.debug(sys.exc_info()[0])
    return HttpResponse(status=400)

def new(request):
    if request.method == 'POST':
        form = PresentationForm(request.POST)

        if form.is_valid():
            newPres = form.save(commit=False)
            logger.debug('user: '+str(request.user.id))
            newPres.user = request.user
            newPres.save()
            return HttpResponseRedirect(newPres.get_absolute_url())
    else:
        form = PresentationForm()

    return render(request, 'presentations/new.html', {'form': form})
