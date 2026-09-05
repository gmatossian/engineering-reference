import { Routes } from '@angular/router';
import { LandingPage } from './landing/landing-page';
import { TopicNotFound } from './topic/topic-not-found';
import { TopicPage } from './topic/topic-page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingPage,
    title: 'Engineering Reference',
  },
  {
    path: 'topics/:id',
    component: TopicPage,
  },
  {
    path: '**',
    component: TopicNotFound,
    title: 'Topic not found | Engineering Reference',
  },
];
