# DynamicCareRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**PlantSpecies** | **string** | Common or scientific plant name | 
**Location** | [**DynamicCareRequestLocation**](DynamicCareRequestLocation.md) |  | 
**Environment** | Pointer to [**DynamicCareRequestEnvironment**](DynamicCareRequestEnvironment.md) |  | [optional] 
**ContainerDetails** | Pointer to [**DynamicCareRequestContainerDetails**](DynamicCareRequestContainerDetails.md) |  | [optional] 
**SoilType** | Pointer to **string** |  | [optional] 
**LastWatered** | Pointer to **string** | Date plant was last watered | [optional] 

## Methods

### NewDynamicCareRequest

`func NewDynamicCareRequest(plantSpecies string, location DynamicCareRequestLocation, ) *DynamicCareRequest`

NewDynamicCareRequest instantiates a new DynamicCareRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewDynamicCareRequestWithDefaults

`func NewDynamicCareRequestWithDefaults() *DynamicCareRequest`

NewDynamicCareRequestWithDefaults instantiates a new DynamicCareRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetPlantSpecies

`func (o *DynamicCareRequest) GetPlantSpecies() string`

GetPlantSpecies returns the PlantSpecies field if non-nil, zero value otherwise.

### GetPlantSpeciesOk

`func (o *DynamicCareRequest) GetPlantSpeciesOk() (*string, bool)`

GetPlantSpeciesOk returns a tuple with the PlantSpecies field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPlantSpecies

`func (o *DynamicCareRequest) SetPlantSpecies(v string)`

SetPlantSpecies sets PlantSpecies field to given value.


### GetLocation

`func (o *DynamicCareRequest) GetLocation() DynamicCareRequestLocation`

GetLocation returns the Location field if non-nil, zero value otherwise.

### GetLocationOk

`func (o *DynamicCareRequest) GetLocationOk() (*DynamicCareRequestLocation, bool)`

GetLocationOk returns a tuple with the Location field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLocation

`func (o *DynamicCareRequest) SetLocation(v DynamicCareRequestLocation)`

SetLocation sets Location field to given value.


### GetEnvironment

`func (o *DynamicCareRequest) GetEnvironment() DynamicCareRequestEnvironment`

GetEnvironment returns the Environment field if non-nil, zero value otherwise.

### GetEnvironmentOk

`func (o *DynamicCareRequest) GetEnvironmentOk() (*DynamicCareRequestEnvironment, bool)`

GetEnvironmentOk returns a tuple with the Environment field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnvironment

`func (o *DynamicCareRequest) SetEnvironment(v DynamicCareRequestEnvironment)`

SetEnvironment sets Environment field to given value.

### HasEnvironment

`func (o *DynamicCareRequest) HasEnvironment() bool`

HasEnvironment returns a boolean if a field has been set.

### GetContainerDetails

`func (o *DynamicCareRequest) GetContainerDetails() DynamicCareRequestContainerDetails`

GetContainerDetails returns the ContainerDetails field if non-nil, zero value otherwise.

### GetContainerDetailsOk

`func (o *DynamicCareRequest) GetContainerDetailsOk() (*DynamicCareRequestContainerDetails, bool)`

GetContainerDetailsOk returns a tuple with the ContainerDetails field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetContainerDetails

`func (o *DynamicCareRequest) SetContainerDetails(v DynamicCareRequestContainerDetails)`

SetContainerDetails sets ContainerDetails field to given value.

### HasContainerDetails

`func (o *DynamicCareRequest) HasContainerDetails() bool`

HasContainerDetails returns a boolean if a field has been set.

### GetSoilType

`func (o *DynamicCareRequest) GetSoilType() string`

GetSoilType returns the SoilType field if non-nil, zero value otherwise.

### GetSoilTypeOk

`func (o *DynamicCareRequest) GetSoilTypeOk() (*string, bool)`

GetSoilTypeOk returns a tuple with the SoilType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSoilType

`func (o *DynamicCareRequest) SetSoilType(v string)`

SetSoilType sets SoilType field to given value.

### HasSoilType

`func (o *DynamicCareRequest) HasSoilType() bool`

HasSoilType returns a boolean if a field has been set.

### GetLastWatered

`func (o *DynamicCareRequest) GetLastWatered() string`

GetLastWatered returns the LastWatered field if non-nil, zero value otherwise.

### GetLastWateredOk

`func (o *DynamicCareRequest) GetLastWateredOk() (*string, bool)`

GetLastWateredOk returns a tuple with the LastWatered field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLastWatered

`func (o *DynamicCareRequest) SetLastWatered(v string)`

SetLastWatered sets LastWatered field to given value.

### HasLastWatered

`func (o *DynamicCareRequest) HasLastWatered() bool`

HasLastWatered returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


