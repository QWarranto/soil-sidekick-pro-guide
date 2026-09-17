# TurboQuantCapabilitiesRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**DeviceMemoryGb** | Pointer to **float32** | Device RAM in GB | [optional] 
**HasWebgpu** | Pointer to **bool** | Whether WebGPU is available | [optional] 
**Platform** | Pointer to **string** |  | [optional] 

## Methods

### NewTurboQuantCapabilitiesRequest

`func NewTurboQuantCapabilitiesRequest() *TurboQuantCapabilitiesRequest`

NewTurboQuantCapabilitiesRequest instantiates a new TurboQuantCapabilitiesRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewTurboQuantCapabilitiesRequestWithDefaults

`func NewTurboQuantCapabilitiesRequestWithDefaults() *TurboQuantCapabilitiesRequest`

NewTurboQuantCapabilitiesRequestWithDefaults instantiates a new TurboQuantCapabilitiesRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetDeviceMemoryGb

`func (o *TurboQuantCapabilitiesRequest) GetDeviceMemoryGb() float32`

GetDeviceMemoryGb returns the DeviceMemoryGb field if non-nil, zero value otherwise.

### GetDeviceMemoryGbOk

`func (o *TurboQuantCapabilitiesRequest) GetDeviceMemoryGbOk() (*float32, bool)`

GetDeviceMemoryGbOk returns a tuple with the DeviceMemoryGb field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDeviceMemoryGb

`func (o *TurboQuantCapabilitiesRequest) SetDeviceMemoryGb(v float32)`

SetDeviceMemoryGb sets DeviceMemoryGb field to given value.

### HasDeviceMemoryGb

`func (o *TurboQuantCapabilitiesRequest) HasDeviceMemoryGb() bool`

HasDeviceMemoryGb returns a boolean if a field has been set.

### GetHasWebgpu

`func (o *TurboQuantCapabilitiesRequest) GetHasWebgpu() bool`

GetHasWebgpu returns the HasWebgpu field if non-nil, zero value otherwise.

### GetHasWebgpuOk

`func (o *TurboQuantCapabilitiesRequest) GetHasWebgpuOk() (*bool, bool)`

GetHasWebgpuOk returns a tuple with the HasWebgpu field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetHasWebgpu

`func (o *TurboQuantCapabilitiesRequest) SetHasWebgpu(v bool)`

SetHasWebgpu sets HasWebgpu field to given value.

### HasHasWebgpu

`func (o *TurboQuantCapabilitiesRequest) HasHasWebgpu() bool`

HasHasWebgpu returns a boolean if a field has been set.

### GetPlatform

`func (o *TurboQuantCapabilitiesRequest) GetPlatform() string`

GetPlatform returns the Platform field if non-nil, zero value otherwise.

### GetPlatformOk

`func (o *TurboQuantCapabilitiesRequest) GetPlatformOk() (*string, bool)`

GetPlatformOk returns a tuple with the Platform field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPlatform

`func (o *TurboQuantCapabilitiesRequest) SetPlatform(v string)`

SetPlatform sets Platform field to given value.

### HasPlatform

`func (o *TurboQuantCapabilitiesRequest) HasPlatform() bool`

HasPlatform returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


