import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'child/feed',
    pathMatch: 'full',
  },
  {
    path: 'child/feed',
    loadComponent: () =>
      import('./pages/child/feed/feed.page').then((m) => m.FeedPage),
  },
  {
    path: 'video/:id',
    loadComponent: () =>
      import('./pages/child/video/video.page').then((m) => m.VideoPage),
  },
];
