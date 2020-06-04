const DEFAULT_PICTURE = 'http://placehold.it/100x100';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json';


function getRecipe() {
    return axios.get('/recipes');
}

function addRecipe(data) {
    return axios.post('/recipes', { ... {}, ...data })
}

function deleteRecipe(id) {
    return axios.delete(`/recipes/${id}`);
}

function createAboutRecipe(article) {

    const $aboutRecipe = $(`
    <li class="media mb-4">
        <img src="${article.picture || DEFAULT_PICTURE}" class="align-self-center mr-3 picCor" alt="...">
        <div class="media-body">
            <h5 id='title' class="mt-0 mb-1">${article.title}</h5>
            <p id='about'>${article.about}</p>
            <small id="author" class="text-muted">${article.author}</small>
        </div>
    </li>`);

    $aboutRecipe.find('#title').on('click', (e) => {
        showRecipe(article);
    });


    return $aboutRecipe;

}

function showRecipe(article) {

    const $recipe = $(`
    <img src="${article.picture || DEFAULT_PICTURE}" class="align-self-center mr-3 pic_mod" alt="...">
    <div><h2 style="text-align: center">${article.title}</h2>
    <p>${article.article}</p>
    <button class='btn btn-primary' id="go-back">Go back</button>
    <button class='btn btn-danger' id="delete">Delete article</button>
    <div>`);

    $('#news-container').hide();
    $('.slider').hide();

    $recipe.find('#go-back').on('click', (e) => {
        $('#news-container').show();
        $('.slider').show();
        $recipe.detach();
    });

    $recipe.find('#delete').on('click', (e) => {
        $('#news-container').show();
        deleteRecipe(article.id);
        $recipe.detach();
    });

    $recipe.appendTo($('.container'));
}


function showAboutRecipe(article) {
    const $aboutRecipe = createAboutRecipe(article);
    $aboutRecipe.appendTo($('#news-list'));
}



// Modal
function showModal() {
    const $modal = $(`<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Ваш будущий рецепт</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <form>
        <div class="form-group">
          <label for="title">Название блюда</label>
          <input type="text" class="form-control" id="title">
          </div>
        <div class="form-group">
          <label for="article">Рецепт</label>
          <textarea rows='5' class="form-control" id="article"></textarea>
        </div>

        <div class="form-group">
        <label for="picture">Картинка блюда</label>
        <input type="text" class="form-control" id="picture">
        </div>

        <div class="form-group">
        <label for="author">Автор</label>
        <input type="text" class="form-control" id="author">
        </div>
      </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button id='save' type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>`);

    $modal.appendTo('body');
    $modal.modal('toggle');
    $modal.on('hidden.bs.modal', () => {
        $modal.detach();
    })

    $modal.find('#save').on('click', e => {
        const title = $modal.find('#title').val();
        const article = $modal.find('#article').val();
        const picture = $modal.find('#picture').val();
        const author = $modal.find('#author').val();
        const about = article.slice(0, 30);

        addRecipe({ title, article, picture, author, about }).then(resp => {
            if (resp.data) {
                resp.data.forEach(article => {
                    showAboutRecipe(article);
                });
            } else {
                alert('No data!');
            }
        });
        $modal.modal('toggle');
    });
}

$(document).ready(() => {
    getRecipe().then(resp => {
        if (resp.data) {
            resp.data.forEach(article => {
                showAboutRecipe(article);
            });
        } else {
            alert('No data!');
        }
    }).catch(error => {
        alert('Error');
        // console.log(error);
    });


    $('#add-article').on('click', e => {
        showModal();
    });

});



// 

function ajax_get(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch (err) {
                // console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}



ajax_get('../db.json', function (data) {
    data.recipes.forEach(element => {
        console.log(element.picture);
        const $recTitle = $(`
                        <a class="dropdown-item" href="#">${element.title}</a>
    `);
        // console.log(element);
        $recTitle.on('click', (e) => {

            showRecipe(element);

        })
        $recTitle.appendTo($('#receptTitle'));

        const $recSlider = $(`

            <div class="sl__slide">
            <img src="${element.picture}" alt="">
            <div class="sl__text">${element.title}</div>
        </div>


            `);

        $recSlider.appendTo($('.sl'));
    })

    $('.sl').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear'
    });

});


//Slick slider



// Modal


