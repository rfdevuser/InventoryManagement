import { gql } from '@apollo/client';

export const GET_FABRIC_DETAILS_BY_CODE = gql`
  query GetFabricDetailsByCode($fabricCode: String!) {
    fabricDetails(fabricCode: $fabricCode) {
      colour
      dateOfPurchase
      fabricCode
      fabricType
      length
      width
    }
  }
`;


export const GET_UPDATED_FABRIC_DETAILS_BY_CODE = gql`
  query GetUpdatedFabricDetailsByCode($fabricCode: String!) {
    updatedFabricInquery(fabricCode: $fabricCode) {
      fabricCode
      purchased_length
      purchased_width
      remainingLength
      remainingWidth
      slnoPrimary
      takingBy
      updated_at
      usedFor
      usedWidth
      usedLength
    }
  }
`;
