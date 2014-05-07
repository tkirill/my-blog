Title: Строго-типизированные extensions для HtmlHelper
Date: 2014-03-20
Slug: strongly-typed-html-helper
Author: tkirill
Summary: Про то, как сделать свой extension для HtmlHelper похожим на стандартные хелперы из ASP.NET MVC вроде `Html.DisplayFor(m => m.Name)` и `Html.LabelFor(m => m.Age)`.  Приводится пример extension для генерации JSON при ренедере HTML в Razor.

Уже не раз мне требовалось написать свой extension для HtmlHelper, который в качестве аргумента принимал бы поле модели.  В очередной раз, когда это случилось, мне нужно было генерировать JSON для передачи данных с сервера в JavaScript код при рендере страницы.  Получившийся метод должен был максимально походить на встроенные в ASP.NET MVC хелперы, то есть:

* Использовать compile-time проверки, никаких строк с названиями полей, как, например, в [Html.TextBox](http://msdn.microsoft.com/en-us/library/dd492494%28v=vs.118%29.aspx).  Это позволяет избегать проблем с типизацией и переименованиями полей.
* Работать с моделью, а не ViewBag.
* Использовать лямбда-выражения для выбора поля.  Это даёт бонус в виде использования вещей из ReSharper, например, автодополнения.

Сейчас у меня есть такой extension и ниже я разберу, как он устроен:

    :::text
    @model IssuesViewModel
    <script>
        var issues = new IssuesCollection(@Html.JsonFor(m => m.Issues));
    </script>

Весь код хелпера занимает три строки, для сериализации используется ServiceStack.Text:

    :::csharp
    public static class HtmlJsonHelper
    {
        public static IHtmlString JsonFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper,
                                                             Expression<Func<TModel, TProperty>> expression)
        {
            var meta = ModelMetadata.FromLambdaExpression(expression, htmlHelper.ViewData);
            var json = JsonSerializer.SerializeToString(meta.Model);
            return htmlHelper.Raw(json);
        }
    }

Здесь используется хелпер из ASP.NET MVC, который позволяет получить ModelMetadata для поля по expression.  Примечательно, что точно таким же способом реализованы встроенные в ASP.NET MVC хелперы.  Посмотрим, например, на реализацию Html.LabelFor:

    :::csharp
    public static MvcHtmlString LabelFor<TModel, TValue>(this HtmlHelper<TModel> html,
                                                         Expression<Func<TModel, TValue>> expression)
    {
        return LabelFor<TModel, TValue>(html, expression, labelText: null);
    }
    
    // ещё несколько перегрузок с разным количеством параметров, которые в конечном счёте вызывают такой internal метод
    
    internal static MvcHtmlString LabelFor<TModel, TValue>(this HtmlHelper<TModel> html,
                                                           Expression<Func<TModel, TValue>> expression,
                                                           string labelText,
                                                           IDictionary<string, object> htmlAttributes,
                                                           ModelMetadataProvider metadataProvider)
    {
        return LabelHelper(html,
                           ModelMetadata.FromLambdaExpression(expression, html.ViewData, metadataProvider),
                           ExpressionHelper.GetExpressionText(expression),
                           labelText,
                           htmlAttributes);
    }

В общем, `ModelMetadata.FromLambdaExpression` берёт на себя всю грязную работу по работе с expression, типами и всеми специфичными для MVC атрибутами, вроде `[DisplayName]`.  Для того, чтобы наш JSON не испортило стандартное HTML-экранирование в Razor, мы используем HtmlHelper.Raw, который возвращает специальную реализацию `IHtmlString`, не использующую экранирование.

Однако HTML-экранирование необходимо использовать в случаях, когда JSON вставляется, например, в значение атрибута для какого-нибудь тега.  Для этого нужно изменить используемую реализацию `IHtmlString`:

    :::csharp
    public static IHtmlString EncodedJsonFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper,
                                                                Expression<Func<TModel, TProperty>> expression)
    {
        var meta = ModelMetadata.FromLambdaExpression(expression, htmlHelper.ViewData);
        var json = JsonSerializer.SerializeToString(meta.Model);
        return new MvcHtmlString(json);
    }

На этом всё.  Для интереса можно посмотреть на полную реализацию Html.LabelFor на GitHub: [LabelExtensions.cs](https://github.com/ASP-NET-MVC/aspnetwebstack/blob/master/src/System.Web.Mvc/Html/LabelExtensions.cs).