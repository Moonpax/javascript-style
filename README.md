# Заметка о перебираемых объектах
https://habr.com/ru/post/526436/

# Google JavaScript Style Guide
https://google.github.io/styleguide/jsguide.html
Руководство по стилю JavaScript от Goggle советует отдавать предпочтение циклу for-of там, где это возможно.


# Airbnb JavaScript Style Guide()
https://github.com/airbnb/javascript
Руководство по стилю JavaScript от Airbnb не рекомендует использовать итераторы. Вместо циклов for-in и for-of следует использовать функции высшего порядка, такие как map(), every(), filter(), find(), findIndex(), reduce(), some() для итерации по массивам и Object.keys(), Object.values(), Object.entries() для итерации по массивам из объектов. Об этом позже.
