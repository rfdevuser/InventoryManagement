import { gql } from '@apollo/client';

export const INSERT_FABRIC_DETAILS = gql`
  mutation MyMutation2(
    $fabricType: String!,
    $colour: String!,
    $length: Float!,
    $width: Float!,
    $price: Float!,
    $dateOfPurchase: String!
  ) {
    insertFabricDetails(
      input: {
        clientMutationId: "test",
        fabricType: $fabricType,
        colour: $colour,
        length: $length,
        width: $width,
        price: $price,
        dateOfPurchase: $dateOfPurchase
      }
    ) {
      clientMutationId
      qrCodeUrl
      responseMessage
    }
  }
`;


export const UPDATE_FABRIC_IN_INVENTORY = gql`
  mutation UpdateFabricInInventory(
    $fabricCode: String!,
    $purchased_length: Float!,
    $purchased_width: Float!,
    $remainingLength: Float!,
    $remainingWidth: Float!,
    $takingBy: String!,
    $usedFor: String!,
    $usedLength: Float!,
    $usedWidth: Float!
  ) {
    updateFabricInInventory(
      input: {
        clientMutationId: "RTEST",
        fabricCode: $fabricCode,
        purchased_length: $purchased_length,
        purchased_width: $purchased_width,
        remainingLength: $remainingLength,
        remainingWidth: $remainingWidth,
        takingBy: $takingBy,
        usedFor: $usedFor,
        usedLength: $usedLength,
        usedWidth: $usedWidth
      }
    ) {
      clientMutationId
      responseMessage
    }
  }
`;
