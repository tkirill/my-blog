Title: Search with Pattern в ReSharper
Date: 2014-04-02
Slug: resharper-search-with-pattern
Author: tkirill
Summary: Случай из жизни, когда Search with Pattern из ReSharper помог переехать на новые соглашения по написанию тестов и сэкономил много времени.

Долгое время я ждал задачи, в которой получилось бы использовать Search with Pattern -- многообещающую фичу ReSharper, которую по-русски я буду называть структурным поиском.  В этом поиске используются шаблоны, которые похожи на регулярные выражения, только работающие в грамматике C#, то есть они оперируют идентификаторами, переменными, выражениями и другими структурами языка.

Например, пусть раньше в тестах для сравнения строк без учёта регистра использовался StringAssert:

```cs
StringAssert.AreEqualIgnoringCase("2013.1.1", new DateTime(2013, 1, 1).ToString("yyyy.M.d"));
//...
StringAssert.AreEqualIgnoringCase("AA"+"bb", string.Concat("aa", "BB"));
```

То есть, в качестве первого и второго аргументов могут передаваться произвольные выражения, а не только строковые литералы.  Теперь представим, что в проекте поменялись соглашения и теперь все проверки принято записывать через Assert.That.  Наш пример в новых соглашениях будет выглядеть так:

```cs
Assert.That(new DateTime(2013, 1, 1).ToString("yyyy.M.d"), Is.EqualTo("2013.1.1").IgnoreCase);
//...
Assert.That(string.Concat("aa", "BB"), Is.EqualTo("AA" + "bb").IgnoreCase);
```

Мы можем использовать структурный поиск для замены старого способа записи на новый.  Выбрав пункт меню ReSharper -> Find -> Search with Pattern и нажав в открывшемся окне на Replace в верхнем правом углу мы приступаем к написанию шаблона.

![ReSharper Search with Pattern window]({filename}/images/resharper-search-with-pattern/empty-search-with-pattern.png "ReSharper Search with Pattern window")

Шаблон для поиска:

```cs
StringAssert.AreEqualIgnoringCase($expected$, $actual$);
```

Шаблон для замены:

```cs
Assert.That($actual$, Is.EqualTo($expected$).IgnoreCase);
```

expected и actual обозначают аргументы, мы задаём это явно в настройках placeholder:

![Argument constraints in ReSharper Search with Pattern]({filename}/images/resharper-search-with-pattern/argument-constraint.png "Argument constraints in ReSharper Search with Pattern")

Нам остаётся нажать Replace, остальное сделает ReSharper.