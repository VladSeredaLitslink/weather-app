import {
  shallowMount,
  type MountingOptions,
  type VueWrapper,
} from "@vue/test-utils";
import { QueryClient } from "vue-query";
import { nextTick } from "vue";

import LocationSelector from "@/components/LocationSelector.vue";

import type { CountryRO } from "@/api/models/ro/countries";
import type { WeatherData } from "@/api/models/ro/weather";

import SelectorItem from "@/components/SelectorItem.vue";
import TheBox from "@/components/TheBox.vue";
import WeatherPresentation from "@/components/WeatherPresentation.vue";

describe("components/LocationSelector", () => {
  const MOCKED_COUNTRIES: CountryRO[] = [
    {
      country: "country 1",
      iso2: "country_1_iso_2",
      iso3: "country_1_iso_3",
      cities: ["city1"],
    },
    {
      country: "country 2",
      iso2: "country_2_iso_2",
      iso3: "country_2_iso_3",
      cities: ["city2"],
    },
  ];

  let wrapper: VueWrapper<InstanceType<typeof LocationSelector>>;

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  // eslint-disable-next-line
  const createWrapper = (options: MountingOptions<any> = {}) => {
    const DEFAULT_PROPS = {
      showBackButton: true,
    };

    wrapper = shallowMount(LocationSelector, {
      ...options,

      props: {
        ...DEFAULT_PROPS,
        ...options.props,
      },
      global: {
        provide: {
          VUE_QUERY_CLIENT: new QueryClient(),
        },
        stubs: {
          SelectorItem,
          TheBox,
          ...options.global?.stubs,
        },
      },
    });
  };

  global.fetch = vi.fn().mockResolvedValue({
    json: () => ({ data: MOCKED_COUNTRIES }),
  });

  const getSelectorItemWithLabel = (label: string) =>
    wrapper
      .findAllComponents(SelectorItem)
      .filter((item) => item.props().label.includes(label))[0];

  const getSelectByLabel = (label: string) => {
    const selectorItem = getSelectorItemWithLabel(label);

    return selectorItem.find("select");
  };

  it("renders the country select options depending on the HTTP request", async () => {
    createWrapper();

    await new Promise(process.nextTick); // wait for global.fetch to finish
    await nextTick(); // wait for re-render

    const countriesSelect = getSelectByLabel("country");
    const countriesOptions = countriesSelect.findAll("option");

    expect(countriesOptions.length).toBe(MOCKED_COUNTRIES.length);
    MOCKED_COUNTRIES.forEach((mockedCountry, index) => {
      expect(countriesOptions[index].text()).toEqual(mockedCountry.country);
    });
  });

  it("does not render the cities select options before the country select", async () => {
    createWrapper();

    await new Promise(process.nextTick); // wait for global.fetch to finish
    await nextTick(); // wait for re-render

    const citiesSelect = getSelectByLabel("city");
    const citiesOptions = citiesSelect.findAll("option");

    expect(citiesOptions.length).toBe(0);
  });

  it("resets the city value on countries select change", async () => {
    createWrapper();

    await new Promise(process.nextTick); // wait for global.fetch to finish
    await nextTick(); // wait for re-render

    const citiesSelect = getSelectByLabel("city");
    const countriesSelect = getSelectByLabel("country");

    // selecting a country
    countriesSelect.setValue(MOCKED_COUNTRIES[0].iso2);
    await nextTick();

    // selecting a city
    citiesSelect.setValue(MOCKED_COUNTRIES[0].cities[0]);

    // selecting a country again
    countriesSelect.setValue(MOCKED_COUNTRIES[1].iso2);
    await nextTick();

    expect(citiesSelect.element.value).toEqual("");
  });

  it("renders the cities select options after the country is selected", async () => {
    createWrapper();

    await new Promise(process.nextTick); // wait for global.fetch to finish
    await nextTick(); // wait for re-render

    const citiesSelect = getSelectByLabel("city");
    const countriesSelect = getSelectByLabel("country");

    countriesSelect.setValue(MOCKED_COUNTRIES[0].iso2);
    await nextTick();

    expect(citiesSelect.findAll("option").length).toEqual(
      MOCKED_COUNTRIES[0].cities.length
    );
  });

  it("emits a 'submit' event on city select", async () => {
    createWrapper();

    await new Promise(process.nextTick); // wait for global.fetch to finish
    await nextTick(); // wait for re-render

    const citiesSelect = getSelectByLabel("city");
    const countriesSelect = getSelectByLabel("country");

    countriesSelect.setValue(MOCKED_COUNTRIES[0].iso2);
    await nextTick();

    citiesSelect.setValue(MOCKED_COUNTRIES[0].cities[0]);

    expect(wrapper.emitted().submit).toEqual([
      [
        {
          city: MOCKED_COUNTRIES[0].cities[0],
          country: MOCKED_COUNTRIES[0].iso2,
        },
      ],
    ]);
  });

  it("shows the WeatherPresentation component if the appropriate prop is provided", async () => {
    createWrapper({
      props: {
        weather: {} as WeatherData,
      },
    });

    expect(wrapper.findComponent(WeatherPresentation).exists()).toBe(true);
    wrapper.setProps({
      weather: undefined,
    });

    await nextTick();
    expect(wrapper.findComponent(WeatherPresentation).exists()).toBe(false);
  });

  describe("Back button", () => {
    const getBackButton = () =>
      wrapper.findAll("button").filter((item) => item.text() === "Back")[0];

    it("is rendered depending on the provided prop", async () => {
      createWrapper({
        props: {
          showBackButton: true,
          weather: {} as WeatherData,
        },
        global: {
          stubs: {
            WeatherPresentation: {
              template: '<slot name="actions" />',
              props: ["data"],
            },
          },
        },
      });

      expect(getBackButton().exists()).toBe(true);

      wrapper.setProps({
        showBackButton: false,
      });
      await nextTick();

      expect(getBackButton()).toBe(undefined);
    });

    it("emits 'set-manual' event on click", async () => {
      createWrapper({
        props: {
          showBackButton: true,
          weather: {} as WeatherData,
        },
        global: {
          stubs: {
            WeatherPresentation: {
              template: '<slot name="actions" />',
              props: ["data"],
            },
          },
        },
      });

      getBackButton().trigger("click");

      expect(wrapper.emitted()["set-manual"]).toBeTruthy();
    });
  });
});
