import api from './api';

class App {
  constructor() {
    this.series = [];

    this.formElement = document.getElementById('serie-form');
    this.inputElement = document.querySelector('input[name=serie-title]')
    this.listElement = document.getElementById('serie-list');
  
    this.registerEvent();
  }

  registerEvent() {
    this.formElement.onsubmit = event => this.addSerie(event);
  }

  setLoading(loading = true) {
    if (loading === true) {
      let loadingElement = document.createElement('span');
      loadingElement.appendChild(document.createTextNode('Carregando'));
      loadingElement.setAttribute('id', 'loading');

      this.formElement.appendChild(loadingElement);
    } else {
      document.getElementById('loading').remove();
    }
  }

  async addSerie(event) {
    event.preventDefault();

    const serieInput = this.inputElement.value;
    
    this.setLoading();

    try {
      if (serieInput.length === 0) {
        return;
      }

      const response = await api.get(`/singlesearch/shows?q=${serieInput}`);
  
      const { image: { original }, name, genres, summary, officialSite } = response.data;
  
      this.series.push({
        original,
        name,
        genres,
        summary,
        officialSite
      });
  
      this.inputElement.value = '';
      
      this.render();
    } catch(err) {
      alert(`Desculpe! Não encontramos a série "${serieInput}" =/`)
      this.inputElement.value = '';
    }

    this.setLoading(false);
  }

  render() {
    this.listElement.innerHTML = '';

    this.series.forEach(serie => {
      let imgEl = document.createElement('img');
      imgEl.setAttribute('src', serie.original);

      let titleEl = document.createElement('strong');
      titleEl.appendChild(document.createTextNode(serie.name));

      let descriptionEl = document.createElement('p');
      descriptionEl.appendChild(document.createTextNode(serie.summary));

      let genresEl = document.createElement('p');
      genresEl.appendChild(document.createTextNode(serie.genres));

      let linkEl = document.createElement('a');
      linkEl.setAttribute('target', '_blank');
      linkEl.setAttribute('href', serie.officialSite);
      linkEl.appendChild(document.createTextNode('Acessar'));

      let listItemEl = document.createElement('li');
      listItemEl.appendChild(imgEl);
      listItemEl.appendChild(titleEl);
      listItemEl.appendChild(descriptionEl);
      listItemEl.appendChild(genresEl);
      listItemEl.appendChild(linkEl);

      this.listElement.appendChild(listItemEl);
    });
  }
}

new App();
