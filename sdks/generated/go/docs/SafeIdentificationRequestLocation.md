# SafeIdentificationRequestLocation

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**CountyFips** | Pointer to **string** |  | [optional] 
**StateCode** | Pointer to **string** |  | [optional] 
**Coordinates** | Pointer to [**SafeIdentificationRequestLocationCoordinates**](SafeIdentificationRequestLocationCoordinates.md) |  | [optional] 

## Methods

### NewSafeIdentificationRequestLocation

`func NewSafeIdentificationRequestLocation() *SafeIdentificationRequestLocation`

NewSafeIdentificationRequestLocation instantiates a new SafeIdentificationRequestLocation object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSafeIdentificationRequestLocationWithDefaults

`func NewSafeIdentificationRequestLocationWithDefaults() *SafeIdentificationRequestLocation`

NewSafeIdentificationRequestLocationWithDefaults instantiates a new SafeIdentificationRequestLocation object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetCountyFips

`func (o *SafeIdentificationRequestLocation) GetCountyFips() string`

GetCountyFips returns the CountyFips field if non-nil, zero value otherwise.

### GetCountyFipsOk

`func (o *SafeIdentificationRequestLocation) GetCountyFipsOk() (*string, bool)`

GetCountyFipsOk returns a tuple with the CountyFips field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountyFips

`func (o *SafeIdentificationRequestLocation) SetCountyFips(v string)`

SetCountyFips sets CountyFips field to given value.

### HasCountyFips

`func (o *SafeIdentificationRequestLocation) HasCountyFips() bool`

HasCountyFips returns a boolean if a field has been set.

### GetStateCode

`func (o *SafeIdentificationRequestLocation) GetStateCode() string`

GetStateCode returns the StateCode field if non-nil, zero value otherwise.

### GetStateCodeOk

`func (o *SafeIdentificationRequestLocation) GetStateCodeOk() (*string, bool)`

GetStateCodeOk returns a tuple with the StateCode field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStateCode

`func (o *SafeIdentificationRequestLocation) SetStateCode(v string)`

SetStateCode sets StateCode field to given value.

### HasStateCode

`func (o *SafeIdentificationRequestLocation) HasStateCode() bool`

HasStateCode returns a boolean if a field has been set.

### GetCoordinates

`func (o *SafeIdentificationRequestLocation) GetCoordinates() SafeIdentificationRequestLocationCoordinates`

GetCoordinates returns the Coordinates field if non-nil, zero value otherwise.

### GetCoordinatesOk

`func (o *SafeIdentificationRequestLocation) GetCoordinatesOk() (*SafeIdentificationRequestLocationCoordinates, bool)`

GetCoordinatesOk returns a tuple with the Coordinates field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCoordinates

`func (o *SafeIdentificationRequestLocation) SetCoordinates(v SafeIdentificationRequestLocationCoordinates)`

SetCoordinates sets Coordinates field to given value.

### HasCoordinates

`func (o *SafeIdentificationRequestLocation) HasCoordinates() bool`

HasCoordinates returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


