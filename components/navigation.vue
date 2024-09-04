<template>
  <nav class="sm:tw-basis-2/3 grow-1" aria-label="Primary">
    <ul class="sm:flex">
      <li><a href="/blog" class="block p-2 hover:underline hover:text-red-600 text-red-600" aria-current="page">Blog</a></li>
      <li><a href="/guestbook" class="block p-2 hover:underline hover:text-red-600 text-red-600" aria-current="page">Guestbook</a></li>
    <!---  {% for page in pages %}
        <li><a href="{{ page.url }}" class="block p-2 hover:underline hover:text-red-600{% if segment1 == page.slug %} text-red-600" aria-current="page{% endif %}">{{ page.title }}</a></li>
      {% endfor %}-->
    </ul>
  </nav>
</template>