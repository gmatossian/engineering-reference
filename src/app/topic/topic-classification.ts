import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { TopicDomainKey, TopicKindKey } from '../../../contracts/runtime-catalog';
import type { CatalogOption } from '../catalog/catalog.service';

@Component({
  imports: [RouterLink],
  selector: 'app-topic-classification',
  styleUrl: './topic-classification.css',
  templateUrl: './topic-classification.html',
})
export class TopicClassification {
  readonly domains = input.required<readonly CatalogOption<TopicDomainKey>[]>();
  readonly kind = input.required<CatalogOption<TopicKindKey>>();
}
