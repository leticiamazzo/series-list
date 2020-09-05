import api from './api';

class App {
  constructor() {
    this.repositories = [];

    this.formElement = document.getElementById('repo-form');
    this.inputElement = document.querySelector('input[name=repository]')
    this.listElement = document.getElementById('repo-list');
  
    this.registerEvent();
  }

  registerEvent() {
    this.formElement.onsubmit = event => this.addRepository(event);
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

  async addRepository(event) {
    event.preventDefault();

    const repoInput = this.inputElement.value;
    
    this.setLoading();

    try {
      if (repoInput.length === 0) {
        return;
      }
;
      const response = await api.get(`/singlesearch/shows?q=${repoInput}`);
  
      const { name, genres, summary, officialSite, image: { original } } = response.data;
  
      this.repositories.push({
        name,
        genres,
        summary,
        original,
        officialSite
      });
  
      this.inputElement.value = '';
      
      this.render();
    } catch(err) {
      alert(`O repositório "${repoInput}" não existe`)
      this.inputElement.value = '';
    }

    this.setLoading(false);
  }

  render() {
    this.listElement.innerHTML = '';

    this.repositories.forEach(repo => {
      let imgEl = document.createElement('img');
      imgEl.setAttribute('src', repo.original);

      let titleEl = document.createElement('strong');
      titleEl.appendChild(document.createTextNode(repo.name));

      let descriptionEl = document.createElement('p');
      descriptionEl.appendChild(document.createTextNode(repo.summary));

      let genresEl = document.createElement('p');
      genresEl.appendChild(document.createTextNode(repo.genres));

      let linkEl = document.createElement('a');
      linkEl.setAttribute('target', '_blank');
      linkEl.setAttribute('href', repo.officialSite);
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