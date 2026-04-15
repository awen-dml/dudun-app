<template>
  <div class="card">
    <img :src="article.urlToImage || fallback" />
    <div class="content">
      <h3>{{ article.title }}</h3>
      <p>{{ article.description || 'No description' }}</p>

      <small>
        {{ article.author || 'Unknown' }} •
        {{ formatDate(article.publishedAt) }}
      </small>
    </div>
  </div>
</template>