Title: Когда включается автоматичекая отправка HTML форм, а когда -- нет
Date: 2016-03-16
Slug: html-form-implicit-submission
Author: tkirill

<!-- PELICAN_BEGIN_SUMMARY -->
Настало время разобраться как работает автоматическая отправка формы по нажатию на Enter, а то каждый раз приходится разбираться, почему форма отправляется или не отправляется.  Всё это хорошо описано в стандарте HTML под названием *implicit submission* и, оказывается, поведение автоматической отправки форм зависит от наличия у формы submit-кнопки.  Давайте посмотрим, что происходит когда submit-кнопка есть и когда её нет.
<!-- PELICAN_END_SUMMARY -->

### Когда submit-кнопка есть

Во-первых, поведение автоматической отправки зависит от наличия у формы submit-кнопки.  Когда такая кнопка есть, отправка по нажатию на Enter просто работает, как видно на этом примере:

<div class="example card card-example">
    <div class="card-header">Форма с submit-кнопкой</div>
    <div class="card-block">
        <form class="example-form">
            <div class="form-group row">
                <label for="input-text1" class="col-sm-2 form-control-label">Поле 1</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="input-text1" placeholder="Текст">
                </div>
            </div>
            <div class="form-group row">
                <label for="input-text2" class="col-sm-2 form-control-label">Поле 2</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="input-text2" placeholder="Текст">
                </div>
            </div>
            <div class="form-group row">
                <label for="textarea1" class="col-sm-2 form-control-label">Поле 3</label>
                <div class="col-sm-10">
                    <textarea type="text" class="form-control" id="textarea1" placeholder="Текст"></textarea>
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-offset-2 col-sm-2">
                    <button type="submit" class="btn btn-secondary">Submit</button>
                </div>
                <div class="col-sm-offset-1 col-sm-4">
                    <span class="submit-indicator">Выполнена отправка!</span>
                </div>
            </div>
        </form>
    </div>
</div>

Отправку формы можно отследить по индикатору отправки, расположенному справа от кнопки Submit-- он подписан на событие submit формы и загорается, когда это событие происходит.  Если нажать Enter в любом из однострочных полей, то форма отправится.

То же самое произойдёт и с другими типами полей -- checkbox, radio, однако не любое поле в форме обладает таким свойством.  Очевидное исключение -- textarea, в котором Enter используется для перевода строк.  Вы можете это проверить в форме выше.

### Когда submit-кнопки нет

При отсутствии submit-кнопки автоматическая отправка может работать, а может и нет.  Зависит это от количества полей в форме -- если форма имеет лишь одно поле, то отправка по Enter работает.  В противном же случае, если полей несколько, форма по Enter отправляться не будет.  Проверим это на двух формах, с одним полем и двумя полями соответственно:

<div class="example card card-example">
    <div class="card-header">Форма с одним полем</div>
    <div class="card-block">
        <form class="example-form">
            <div class="form-group row">
                <label for="input-text1" class="col-sm-2 form-control-label">Поле 1</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="input-text1" placeholder="Текст">
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-offset-4 col-sm-4">
                    <span class="submit-indicator">Выполнена отправка!</span>
                </div>
            </div>
        </form>
    </div>
</div>

<div class="example card card-example">
    <div class="card-header">Форма с двумя полями</div>
    <div class="card-block">
        <form class="example-form">
            <div class="form-group row">
                <label for="input-text1" class="col-sm-2 form-control-label">Поле 1</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="input-text1" placeholder="Текст">
                </div>
            </div>
            <div class="form-group row">
                <label for="input-text2" class="col-sm-2 form-control-label">Поле 2</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="input-text2" placeholder="Текст">
                </div>
            </div>
            <div class="form-group row">
                <div class="col-sm-offset-4 col-sm-4">
                    <span class="submit-indicator">Выполнена отправка!</span>
                </div>
            </div>
        </form>
    </div>
</div>

Такое поведение -- при отсутствии submit-кнопки отправлять по Enter только формы с одним полем -- закреплено давно и описано аж в [HTML 2][implicit-submission-html2].  Жаль, но в стандарте нет комментария с объяснением этого ограничения и у меня не получилось найти достоверных версий в сети.  Судя по всему, это защита от случайной отправки в процессе заполнения больших форм, состоящих из нескольких полей.

Есть ещё одна интересная деталь.  В текущем стандарте HTML 5, в отличие от HTML 2, уточняется тип полей, которые учитываются при решении включать автоматическую отправку формы или нет.  Браузер подсчитывает только input типов text, search, url, tel, email, password, date, time и number.  Количество других полей значения не имеет.

Другими словами, форма с одним `<input type="text">` будет отправлена по Enter, равно как и форма в которой кроме `<input type="text">` будет ещё и набор `<input type="radio">`.  В то же время, форма с двумя `<input type="text">` или с двумя `<input type="number">` отправлена не будет.

Давайте проверим, что сложная форма с несколькими контролами, среди которых, однако, лишь один `<input type="text">`, действительно автоматически отправляется по нажатию на Enter:

<div class="example card card-example">
    <div class="card-header">Сложная форма с одним input type=text</div>
    <div class="card-block">
        <form class="example-form">
            <div class="form-group">
                <input type="text" class="form-control" placeholder="Текст">
            </div>
            <div class="form-group">
                <div class="radio">
                    <label>
                        <input type="radio" name="radio1" value="option1" checked>
                        Option 1
                    </label>
                </div>
                <div class="radio">
                    <label>
                        <input type="radio" name="radio1" value="option2">
                        Option 2
                    </label>
                </div>
            </div>
            <div class="form-group">
                <textarea type="text" class="form-control" placeholder="Текст"></textarea>
            </div>
            <div class="form-group row">
                <div class="col-sm-offset-4 col-sm-4">
                    <span class="submit-indicator">Выполнена отправка!</span>
                </div>
            </div>
        </form>
    </div>
</div>

Это странное поведение, которое не согласуется с версией о защите от случайно отправки не до конца заполненных сложных форм.  Вряд ли это баг в браузере, уж слишком давно такое поведение существует.  Теперь узнать настоящие мотивы ограничения на один `input` определённого типа стало ещё интереснее.

### Итого

Подведём итог.  Форма будет автоматически отправлена по нажатию на Enter в одном из двух случаев:

 * Либо у формы есть submit-кнопка
 * Либо submit-кнопки нет, но у формы не более одного `input` типа text, search, url, tel, email, password, date, time или number

 Параграф, посвящённый implicit submission в актуальном стандарте HTML 5 -- [#4.10.22.2][implicit-submission-html5].


[implicit-submission-html2]: https://www.w3.org/MarkUp/html-spec/html-spec_8.html#SEC8.2 "Документация на implicit submission в стандарте HTML 2"
[implicit-submission-html5]: https://www.w3.org/TR/html5/forms.html#implicit-submission "Документация на implicit submission в стандарте HTML 2"

<script src="{filename}/js/jquery/jquery-2.2.2.min.js"></script>
<script src="{filename}/js/html-form-implicit-submission/example-form.js"></script>