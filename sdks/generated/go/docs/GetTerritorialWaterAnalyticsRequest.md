# GetTerritorialWaterAnalyticsRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**TerritoryType** | Pointer to **string** | Type of territory to analyze | [optional] 
**EpaRegion** | Pointer to **string** | EPA region identifier | [optional] 
**DateRange** | Pointer to [**GetTerritorialWaterAnalyticsRequestDateRange**](GetTerritorialWaterAnalyticsRequestDateRange.md) |  | [optional] 

## Methods

### NewGetTerritorialWaterAnalyticsRequest

`func NewGetTerritorialWaterAnalyticsRequest() *GetTerritorialWaterAnalyticsRequest`

NewGetTerritorialWaterAnalyticsRequest instantiates a new GetTerritorialWaterAnalyticsRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGetTerritorialWaterAnalyticsRequestWithDefaults

`func NewGetTerritorialWaterAnalyticsRequestWithDefaults() *GetTerritorialWaterAnalyticsRequest`

NewGetTerritorialWaterAnalyticsRequestWithDefaults instantiates a new GetTerritorialWaterAnalyticsRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetTerritoryType

`func (o *GetTerritorialWaterAnalyticsRequest) GetTerritoryType() string`

GetTerritoryType returns the TerritoryType field if non-nil, zero value otherwise.

### GetTerritoryTypeOk

`func (o *GetTerritorialWaterAnalyticsRequest) GetTerritoryTypeOk() (*string, bool)`

GetTerritoryTypeOk returns a tuple with the TerritoryType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTerritoryType

`func (o *GetTerritorialWaterAnalyticsRequest) SetTerritoryType(v string)`

SetTerritoryType sets TerritoryType field to given value.

### HasTerritoryType

`func (o *GetTerritorialWaterAnalyticsRequest) HasTerritoryType() bool`

HasTerritoryType returns a boolean if a field has been set.

### GetEpaRegion

`func (o *GetTerritorialWaterAnalyticsRequest) GetEpaRegion() string`

GetEpaRegion returns the EpaRegion field if non-nil, zero value otherwise.

### GetEpaRegionOk

`func (o *GetTerritorialWaterAnalyticsRequest) GetEpaRegionOk() (*string, bool)`

GetEpaRegionOk returns a tuple with the EpaRegion field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEpaRegion

`func (o *GetTerritorialWaterAnalyticsRequest) SetEpaRegion(v string)`

SetEpaRegion sets EpaRegion field to given value.

### HasEpaRegion

`func (o *GetTerritorialWaterAnalyticsRequest) HasEpaRegion() bool`

HasEpaRegion returns a boolean if a field has been set.

### GetDateRange

`func (o *GetTerritorialWaterAnalyticsRequest) GetDateRange() GetTerritorialWaterAnalyticsRequestDateRange`

GetDateRange returns the DateRange field if non-nil, zero value otherwise.

### GetDateRangeOk

`func (o *GetTerritorialWaterAnalyticsRequest) GetDateRangeOk() (*GetTerritorialWaterAnalyticsRequestDateRange, bool)`

GetDateRangeOk returns a tuple with the DateRange field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDateRange

`func (o *GetTerritorialWaterAnalyticsRequest) SetDateRange(v GetTerritorialWaterAnalyticsRequestDateRange)`

SetDateRange sets DateRange field to given value.

### HasDateRange

`func (o *GetTerritorialWaterAnalyticsRequest) HasDateRange() bool`

HasDateRange returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


