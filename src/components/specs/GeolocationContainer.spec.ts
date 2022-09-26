import type { VueWrapper } from "@vue/test-utils";
import { shallowMount } from "@vue/test-utils";

import GeolocationContainer from "@/components/GeolocationContainer.vue";
import { nextTick } from "vue";
import {
  GEOLOCATION_ERROR_MESSAGES,
  LOADING_GEOLOCATION_MESSAGE,
} from "@/components/constants";

describe("components/GeolocationContainer.vue", () => {
  const MOCKED_GEOLOCATION = {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  } as Geolocation;
  const DEFAULT_SLOT_TEMPLATE = "Slot template";

  let wrapper: VueWrapper<InstanceType<typeof GeolocationContainer>>;

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  // eslint-disable-next-line
  const createWrapper = () => {
    wrapper = shallowMount(GeolocationContainer, {
      slots: {
        default: DEFAULT_SLOT_TEMPLATE,
      },
    });
  };

  it("gets the user's geoposition", () => {
    global.navigator = {
      geolocation: MOCKED_GEOLOCATION,
    } as Navigator;

    createWrapper();

    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("shows loading message to the user", () => {
    global.navigator = {
      geolocation: MOCKED_GEOLOCATION,
    } as Navigator;

    createWrapper();

    expect(wrapper.text()).toContain(LOADING_GEOLOCATION_MESSAGE);
  });

  it("renders a slot content if the geolocation request has succeeded", async () => {
    global.navigator = {
      geolocation: {
        ...MOCKED_GEOLOCATION,
        getCurrentPosition: vi.fn((successCallback) =>
          successCallback({} as GeolocationPosition)
        ),
      } as Geolocation,
    } as Navigator;

    createWrapper();

    expect(wrapper.text()).toContain(DEFAULT_SLOT_TEMPLATE);
  });

  describe("Geolocation error", () => {
    const BASE_MOCKED_GEOLOCATION_ERROR = {
      code: 1,
      PERMISSION_DENIED: 0,
      POSITION_UNAVAILABLE: 0,
      TIMEOUT: 0,
      message: "",
    };

    it("shows default slot if manual selection is set", async () => {
      global.navigator = {
        geolocation: {
          ...MOCKED_GEOLOCATION,
          getCurrentPosition: vi.fn((successCallback, errorCallback) =>
            errorCallback?.({ ...BASE_MOCKED_GEOLOCATION_ERROR, TIMEOUT: 1 })
          ),
        } as Geolocation,
      } as Navigator;

      createWrapper();
      await nextTick();

      const manualSelectionBtn = wrapper
        .findAll("button")
        .filter((item) => item.text().includes("manual selection"))?.[0];

      await manualSelectionBtn.trigger("click");
      await nextTick();

      expect(wrapper.text()).toContain(DEFAULT_SLOT_TEMPLATE);
    });

    it.each([
      {
        error: { PERMISSION_DENIED: 1 },
        errorName: "'permission denied'",
        message: GEOLOCATION_ERROR_MESSAGES.PERMISSION_DENIED,
      },
      {
        error: { POSITION_UNAVAILABLE: 1 },
        errorName: "'position unavailable'",
        message: GEOLOCATION_ERROR_MESSAGES.POSITION_UNAVAILABLE,
      },
      {
        error: { TIMEOUT: 1 },
        errorName: "'timeout error'",
        message: GEOLOCATION_ERROR_MESSAGES.TIMEOUT,
      },
    ])(
      "shows an error message if geolocation request failed with $errorName error",
      async ({ error, message }) => {
        const MOCKED_GEOLOCATION_ERROR = {
          ...BASE_MOCKED_GEOLOCATION_ERROR,
          ...error,
        };

        global.navigator = {
          geolocation: {
            ...MOCKED_GEOLOCATION,
            getCurrentPosition: vi.fn((successCallback, errorCallback) =>
              errorCallback?.(MOCKED_GEOLOCATION_ERROR)
            ),
          } as Geolocation,
        } as Navigator;
        createWrapper();

        await nextTick();

        expect(wrapper.text()).toContain(message);
      }
    );
  });
});
