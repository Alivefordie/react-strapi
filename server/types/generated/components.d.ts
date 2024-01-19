import type { Schema, Attribute } from '@strapi/strapi';

export interface HistoyHistory extends Schema.Component {
  collectionName: 'components_histoy_histories';
  info: {
    displayName: 'history';
    icon: 'clock';
    description: '';
  };
  attributes: {
    label: Attribute.String;
    slug: Attribute.String;
  };
}

export interface ScoreEntity extends Schema.Component {
  collectionName: 'components_score_entities';
  info: {
    displayName: 'entry';
    icon: 'emotionHappy';
    description: '';
  };
  attributes: {
    label: Attribute.String;
    JSONdata: Attribute.JSON;
    student: Attribute.Relation<
      'score.entity',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    seen: Attribute.DateTime;
    noted: Attribute.DateTime;
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
