import { Component, inject } from '@angular/core';
import { CatalogService } from '../catalog/catalog.service';
import { TopicLinkList } from '../topic/topic-link-list';

@Component({
  imports: [TopicLinkList],
  selector: 'app-landing-page',
  styleUrl: './landing-page.css',
  templateUrl: './landing-page.html',
})
export class LandingPage {
  protected readonly topics = inject(CatalogService).getLandingTopics();
}
