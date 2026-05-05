---
layout: plain-text
permalink: /blog/
title: blog
nav: true
nav_order: 3
plain_body_class: plain-writing-page
---

<main class="plain-idx" role="main">
  <div class="plain-back">
    <a href="{{ '/' | relative_url }}"><span class="arr">&larr;</span>cd ~</a>
  </div>

  <div class="plain-idx-head">
    <span class="title"><span class="sigil">$</span>ls /blog</span>
    {% assign post_count = site.posts | size %}
    <span class="meta">
      {{ post_count }} {% if post_count == 1 %}entry{% else %}entries{% endif %} · newest first
    </span>
  </div>

  <div class="plain-idx-filters" id="plain-writing-filters">
    <span class="lbl">filter:</span>
    <button class="plain-filter on" type="button" data-tag="all" aria-pressed="true">all</button>
    {% assign sorted_tags = site.tags | sort %}
    {% for tag in sorted_tags %}
      {% assign tag_name = tag[0] %}
      <button class="plain-filter" type="button" data-tag="{{ tag_name | slugify }}" aria-pressed="false">
        {{ tag_name }}
      </button>
    {% endfor %}
  </div>

  {% assign current_year = '' %}
  {% for post in site.posts %}
    {% assign year = post.date | date: '%Y' %}
    {% if year != current_year %}
      {% unless forloop.first %}
        </section>
      {% endunless %}
      <section class="plain-year" data-year-group>
        <div class="plain-year-row">{{ year }}</div>
      {% assign current_year = year %}
    {% endif %}

    {% assign primary_tag = post.tags | first %}
    {% if primary_tag == nil or primary_tag == '' %}
      {% assign primary_tag = post.categories | first %}
    {% endif %}
    {% assign tag_slugs = '' %}
    {% for tag in post.tags %}
      {% assign tag_slugs = tag_slugs | append: ' ' | append: tag | slugify %}
    {% endfor %}
    {% for category in post.categories %}
      {% assign tag_slugs = tag_slugs | append: ' ' | append: category | slugify %}
    {% endfor %}

    {% if post.redirect == blank %}
      {% assign post_href = post.url | relative_url %}
      {% assign external_post = false %}
    {% elsif post.redirect contains '://' %}
      {% assign post_href = post.redirect %}
      {% assign external_post = true %}
    {% else %}
      {% assign post_href = post.redirect | relative_url %}
      {% assign external_post = false %}
    {% endif %}

    <a
      class="plain-entry"
      data-tags="{{ tag_slugs | strip }}"
      href="{{ post_href }}"
      {% if external_post %}
        target="_blank" rel="noopener noreferrer"
      {% endif %}
    >
      <span class="date">{{ post.date | date: '%Y-%m-%d' }}</span>
      <span class="title">{{ post.title }}</span>
      <span class="tag">{{ primary_tag | default: 'note' }}</span>
    </a>

    {% if forloop.last %}
      </section>
    {% endif %}
  {% endfor %}

  <div class="plain-empty" id="plain-writing-empty" hidden>no entries match this filter.</div>
</main>
