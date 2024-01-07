import type { Schema, Attribute } from '@strapi/strapi';

export interface HistoyHistory extends Schema.Component {
  collectionName: 'components_histoy_histories';
  info: {
    displayName: 'history';
    icon: 'clock';
  };
  attributes: {
    event: Attribute.Relation<'histoy.history', 'oneToOne', 'api::event.event'>;
  };
}

export interface ScoreEntity extends Schema.Component {
  collectionName: 'components_score_entities';
  info: {
    displayName: 'entity';
    icon: 'emotionHappy';
    description: '';
  };
  attributes: {
    viewed: Attribute.Boolean & Attribute.DefaultTo<false>;
    noted: Attribute.Boolean & Attribute.DefaultTo<false>;
    label: Attribute.String;
    JSONdata: Attribute.JSON;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'histoy.history': HistoyHistory;
      'score.entity': ScoreEntity;
    }
  }
}
