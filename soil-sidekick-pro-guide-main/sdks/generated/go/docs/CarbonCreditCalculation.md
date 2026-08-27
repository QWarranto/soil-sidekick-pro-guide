# CarbonCreditCalculation

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Success** | Pointer to **bool** |  | [optional] 
**CreditRecord** | Pointer to [**CarbonCreditCalculationCreditRecord**](CarbonCreditCalculationCreditRecord.md) |  | [optional] 
**CalculationDetails** | Pointer to [**CarbonCreditCalculationCalculationDetails**](CarbonCreditCalculationCalculationDetails.md) |  | [optional] 

## Methods

### NewCarbonCreditCalculation

`func NewCarbonCreditCalculation() *CarbonCreditCalculation`

NewCarbonCreditCalculation instantiates a new CarbonCreditCalculation object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCarbonCreditCalculationWithDefaults

`func NewCarbonCreditCalculationWithDefaults() *CarbonCreditCalculation`

NewCarbonCreditCalculationWithDefaults instantiates a new CarbonCreditCalculation object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetSuccess

`func (o *CarbonCreditCalculation) GetSuccess() bool`

GetSuccess returns the Success field if non-nil, zero value otherwise.

### GetSuccessOk

`func (o *CarbonCreditCalculation) GetSuccessOk() (*bool, bool)`

GetSuccessOk returns a tuple with the Success field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSuccess

`func (o *CarbonCreditCalculation) SetSuccess(v bool)`

SetSuccess sets Success field to given value.

### HasSuccess

`func (o *CarbonCreditCalculation) HasSuccess() bool`

HasSuccess returns a boolean if a field has been set.

### GetCreditRecord

`func (o *CarbonCreditCalculation) GetCreditRecord() CarbonCreditCalculationCreditRecord`

GetCreditRecord returns the CreditRecord field if non-nil, zero value otherwise.

### GetCreditRecordOk

`func (o *CarbonCreditCalculation) GetCreditRecordOk() (*CarbonCreditCalculationCreditRecord, bool)`

GetCreditRecordOk returns a tuple with the CreditRecord field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreditRecord

`func (o *CarbonCreditCalculation) SetCreditRecord(v CarbonCreditCalculationCreditRecord)`

SetCreditRecord sets CreditRecord field to given value.

### HasCreditRecord

`func (o *CarbonCreditCalculation) HasCreditRecord() bool`

HasCreditRecord returns a boolean if a field has been set.

### GetCalculationDetails

`func (o *CarbonCreditCalculation) GetCalculationDetails() CarbonCreditCalculationCalculationDetails`

GetCalculationDetails returns the CalculationDetails field if non-nil, zero value otherwise.

### GetCalculationDetailsOk

`func (o *CarbonCreditCalculation) GetCalculationDetailsOk() (*CarbonCreditCalculationCalculationDetails, bool)`

GetCalculationDetailsOk returns a tuple with the CalculationDetails field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCalculationDetails

`func (o *CarbonCreditCalculation) SetCalculationDetails(v CarbonCreditCalculationCalculationDetails)`

SetCalculationDetails sets CalculationDetails field to given value.

### HasCalculationDetails

`func (o *CarbonCreditCalculation) HasCalculationDetails() bool`

HasCalculationDetails returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


