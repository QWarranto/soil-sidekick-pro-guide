# DynamicCareRequestLocation

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**CountyFips** | **string** |  | 
**StateCode** | Pointer to **string** |  | [optional] 
**Indoor** | Pointer to **bool** | Whether the plant is indoors | [optional] 

## Methods

### NewDynamicCareRequestLocation

`func NewDynamicCareRequestLocation(countyFips string, ) *DynamicCareRequestLocation`

NewDynamicCareRequestLocation instantiates a new DynamicCareRequestLocation object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewDynamicCareRequestLocationWithDefaults

`func NewDynamicCareRequestLocationWithDefaults() *DynamicCareRequestLocation`

NewDynamicCareRequestLocationWithDefaults instantiates a new DynamicCareRequestLocation object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetCountyFips

`func (o *DynamicCareRequestLocation) GetCountyFips() string`

GetCountyFips returns the CountyFips field if non-nil, zero value otherwise.

### GetCountyFipsOk

`func (o *DynamicCareRequestLocation) GetCountyFipsOk() (*string, bool)`

GetCountyFipsOk returns a tuple with the CountyFips field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountyFips

`func (o *DynamicCareRequestLocation) SetCountyFips(v string)`

SetCountyFips sets CountyFips field to given value.


### GetStateCode

`func (o *DynamicCareRequestLocation) GetStateCode() string`

GetStateCode returns the StateCode field if non-nil, zero value otherwise.

### GetStateCodeOk

`func (o *DynamicCareRequestLocation) GetStateCodeOk() (*string, bool)`

GetStateCodeOk returns a tuple with the StateCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStateCode

`func (o *DynamicCareRequestLocation) SetStateCode(v string)`

SetStateCode sets StateCode field to given value.

### HasStateCode

`func (o *DynamicCareRequestLocation) HasStateCode() bool`

HasStateCode returns a boolean if a field has been set.

### GetIndoor

`func (o *DynamicCareRequestLocation) GetIndoor() bool`

GetIndoor returns the Indoor field if non-nil, zero value otherwise.

### GetIndoorOk

`func (o *DynamicCareRequestLocation) GetIndoorOk() (*bool, bool)`

GetIndoorOk returns a tuple with the Indoor field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIndoor

`func (o *DynamicCareRequestLocation) SetIndoor(v bool)`

SetIndoor sets Indoor field to given value.

### HasIndoor

`func (o *DynamicCareRequestLocation) HasIndoor() bool`

HasIndoor returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


