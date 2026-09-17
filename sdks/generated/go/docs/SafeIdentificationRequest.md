# SafeIdentificationRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Image** | **string** | Base64 encoded image or image URL | 
**Location** | Pointer to [**SafeIdentificationRequestLocation**](SafeIdentificationRequestLocation.md) |  | [optional] 
**Context** | Pointer to [**SafeIdentificationRequestContext**](SafeIdentificationRequestContext.md) |  | [optional] 

## Methods

### NewSafeIdentificationRequest

`func NewSafeIdentificationRequest(image string, ) *SafeIdentificationRequest`

NewSafeIdentificationRequest instantiates a new SafeIdentificationRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewSafeIdentificationRequestWithDefaults

`func NewSafeIdentificationRequestWithDefaults() *SafeIdentificationRequest`

NewSafeIdentificationRequestWithDefaults instantiates a new SafeIdentificationRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetImage

`func (o *SafeIdentificationRequest) GetImage() string`

GetImage returns the Image field if non-nil, zero value otherwise.

### GetImageOk

`func (o *SafeIdentificationRequest) GetImageOk() (*string, bool)`

GetImageOk returns a tuple with the Image field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetImage

`func (o *SafeIdentificationRequest) SetImage(v string)`

SetImage sets Image field to given value.


### GetLocation

`func (o *SafeIdentificationRequest) GetLocation() SafeIdentificationRequestLocation`

GetLocation returns the Location field if non-nil, zero value otherwise.

### GetLocationOk

`func (o *SafeIdentificationRequest) GetLocationOk() (*SafeIdentificationRequestLocation, bool)`

GetLocationOk returns a tuple with the Location field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLocation

`func (o *SafeIdentificationRequest) SetLocation(v SafeIdentificationRequestLocation)`

SetLocation sets Location field to given value.

### HasLocation

`func (o *SafeIdentificationRequest) HasLocation() bool`

HasLocation returns a boolean if a field has been set.

### GetContext

`func (o *SafeIdentificationRequest) GetContext() SafeIdentificationRequestContext`

GetContext returns the Context field if non-nil, zero value otherwise.

### GetContextOk

`func (o *SafeIdentificationRequest) GetContextOk() (*SafeIdentificationRequestContext, bool)`

GetContextOk returns a tuple with the Context field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetContext

`func (o *SafeIdentificationRequest) SetContext(v SafeIdentificationRequestContext)`

SetContext sets Context field to given value.

### HasContext

`func (o *SafeIdentificationRequest) HasContext() bool`

HasContext returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


