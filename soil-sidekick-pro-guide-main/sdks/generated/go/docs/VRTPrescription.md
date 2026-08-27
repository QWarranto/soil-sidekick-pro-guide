# VRTPrescription

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | Pointer to **string** |  | [optional] 
**FieldId** | Pointer to **string** |  | [optional] 
**ApplicationType** | Pointer to **string** |  | [optional] 
**Zones** | Pointer to [**[]VRTPrescriptionZonesInner**](VRTPrescriptionZonesInner.md) |  | [optional] 

## Methods

### NewVRTPrescription

`func NewVRTPrescription() *VRTPrescription`

NewVRTPrescription instantiates a new VRTPrescription object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewVRTPrescriptionWithDefaults

`func NewVRTPrescriptionWithDefaults() *VRTPrescription`

NewVRTPrescriptionWithDefaults instantiates a new VRTPrescription object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *VRTPrescription) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *VRTPrescription) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *VRTPrescription) SetId(v string)`

SetId sets Id field to given value.

### HasId

`func (o *VRTPrescription) HasId() bool`

HasId returns a boolean if a field has been set.

### GetFieldId

`func (o *VRTPrescription) GetFieldId() string`

GetFieldId returns the FieldId field if non-nil, zero value otherwise.

### GetFieldIdOk

`func (o *VRTPrescription) GetFieldIdOk() (*string, bool)`

GetFieldIdOk returns a tuple with the FieldId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFieldId

`func (o *VRTPrescription) SetFieldId(v string)`

SetFieldId sets FieldId field to given value.

### HasFieldId

`func (o *VRTPrescription) HasFieldId() bool`

HasFieldId returns a boolean if a field has been set.

### GetApplicationType

`func (o *VRTPrescription) GetApplicationType() string`

GetApplicationType returns the ApplicationType field if non-nil, zero value otherwise.

### GetApplicationTypeOk

`func (o *VRTPrescription) GetApplicationTypeOk() (*string, bool)`

GetApplicationTypeOk returns a tuple with the ApplicationType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetApplicationType

`func (o *VRTPrescription) SetApplicationType(v string)`

SetApplicationType sets ApplicationType field to given value.

### HasApplicationType

`func (o *VRTPrescription) HasApplicationType() bool`

HasApplicationType returns a boolean if a field has been set.

### GetZones

`func (o *VRTPrescription) GetZones() []VRTPrescriptionZonesInner`

GetZones returns the Zones field if non-nil, zero value otherwise.

### GetZonesOk

`func (o *VRTPrescription) GetZonesOk() (*[]VRTPrescriptionZonesInner, bool)`

GetZonesOk returns a tuple with the Zones field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetZones

`func (o *VRTPrescription) SetZones(v []VRTPrescriptionZonesInner)`

SetZones sets Zones field to given value.

### HasZones

`func (o *VRTPrescription) HasZones() bool`

HasZones returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


