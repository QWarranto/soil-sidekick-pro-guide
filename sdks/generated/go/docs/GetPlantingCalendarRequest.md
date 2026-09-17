# GetPlantingCalendarRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**CountyFips** | **string** |  | 
**CropType** | **string** |  | 

## Methods

### NewGetPlantingCalendarRequest

`func NewGetPlantingCalendarRequest(countyFips string, cropType string, ) *GetPlantingCalendarRequest`

NewGetPlantingCalendarRequest instantiates a new GetPlantingCalendarRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGetPlantingCalendarRequestWithDefaults

`func NewGetPlantingCalendarRequestWithDefaults() *GetPlantingCalendarRequest`

NewGetPlantingCalendarRequestWithDefaults instantiates a new GetPlantingCalendarRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetCountyFips

`func (o *GetPlantingCalendarRequest) GetCountyFips() string`

GetCountyFips returns the CountyFips field if non-nil, zero value otherwise.

### GetCountyFipsOk

`func (o *GetPlantingCalendarRequest) GetCountyFipsOk() (*string, bool)`

GetCountyFipsOk returns a tuple with the CountyFips field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCountyFips

`func (o *GetPlantingCalendarRequest) SetCountyFips(v string)`

SetCountyFips sets CountyFips field to given value.


### GetCropType

`func (o *GetPlantingCalendarRequest) GetCropType() string`

GetCropType returns the CropType field if non-nil, zero value otherwise.

### GetCropTypeOk

`func (o *GetPlantingCalendarRequest) GetCropTypeOk() (*string, bool)`

GetCropTypeOk returns a tuple with the CropType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCropType

`func (o *GetPlantingCalendarRequest) SetCropType(v string)`

SetCropType sets CropType field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


