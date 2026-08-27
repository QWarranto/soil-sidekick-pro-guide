# LeafenginesQueryRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Location** | [**LeafenginesQueryRequestLocation**](LeafenginesQueryRequestLocation.md) |  | 
**Plant** | [**LeafenginesQueryRequestPlant**](LeafenginesQueryRequestPlant.md) |  | 
**Options** | Pointer to [**LeafenginesQueryRequestOptions**](LeafenginesQueryRequestOptions.md) |  | [optional] 

## Methods

### NewLeafenginesQueryRequest

`func NewLeafenginesQueryRequest(location LeafenginesQueryRequestLocation, plant LeafenginesQueryRequestPlant, ) *LeafenginesQueryRequest`

NewLeafenginesQueryRequest instantiates a new LeafenginesQueryRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewLeafenginesQueryRequestWithDefaults

`func NewLeafenginesQueryRequestWithDefaults() *LeafenginesQueryRequest`

NewLeafenginesQueryRequestWithDefaults instantiates a new LeafenginesQueryRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetLocation

`func (o *LeafenginesQueryRequest) GetLocation() LeafenginesQueryRequestLocation`

GetLocation returns the Location field if non-nil, zero value otherwise.

### GetLocationOk

`func (o *LeafenginesQueryRequest) GetLocationOk() (*LeafenginesQueryRequestLocation, bool)`

GetLocationOk returns a tuple with the Location field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLocation

`func (o *LeafenginesQueryRequest) SetLocation(v LeafenginesQueryRequestLocation)`

SetLocation sets Location field to given value.


### GetPlant

`func (o *LeafenginesQueryRequest) GetPlant() LeafenginesQueryRequestPlant`

GetPlant returns the Plant field if non-nil, zero value otherwise.

### GetPlantOk

`func (o *LeafenginesQueryRequest) GetPlantOk() (*LeafenginesQueryRequestPlant, bool)`

GetPlantOk returns a tuple with the Plant field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPlant

`func (o *LeafenginesQueryRequest) SetPlant(v LeafenginesQueryRequestPlant)`

SetPlant sets Plant field to given value.


### GetOptions

`func (o *LeafenginesQueryRequest) GetOptions() LeafenginesQueryRequestOptions`

GetOptions returns the Options field if non-nil, zero value otherwise.

### GetOptionsOk

`func (o *LeafenginesQueryRequest) GetOptionsOk() (*LeafenginesQueryRequestOptions, bool)`

GetOptionsOk returns a tuple with the Options field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOptions

`func (o *LeafenginesQueryRequest) SetOptions(v LeafenginesQueryRequestOptions)`

SetOptions sets Options field to given value.

### HasOptions

`func (o *LeafenginesQueryRequest) HasOptions() bool`

HasOptions returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


