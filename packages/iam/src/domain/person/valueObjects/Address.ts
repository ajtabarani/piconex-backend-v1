export class Address {
  constructor(
    private readonly addressLine1: string,
    private readonly addressLine2: string | null,
    private readonly city: string,
    private readonly geographicalState: string | null,
    private readonly zipCode: string | null,
    private readonly country: string,
  ) {}

  getAddressLine1(): string {
    return this.addressLine1;
  }

  getAddressLine2(): string | null {
    return this.addressLine2;
  }

  getCity(): string {
    return this.city;
  }

  getGeographicalState(): string | null {
    return this.geographicalState;
  }

  getZipCode(): string | null {
    return this.zipCode;
  }

  getCountry(): string {
    return this.country;
  }
}
