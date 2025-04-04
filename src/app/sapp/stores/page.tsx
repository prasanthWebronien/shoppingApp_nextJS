'use client'
import L from 'leaflet';
import Image from "next/image";
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { useSession, getSession } from "next-auth/react";
import { fetchStoresUtils } from '@/utils/helpers';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ArrowLeftIcon from "../components/icons/ArrowLeftIcon";
import UserIcon from "../components/icons/UserIcon";
import { Shop } from '@/types/product';
import SearchIcon from '../components/icons/SearchIcon';

const StoresPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [stores, setStores] = useState<Shop[]>([]);
  const [tempStores, setTeampstores] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [accessToken, setAccessToken] = useState<string>('');
  const [refreshToken, setRefreshToken] = useState<string>('');
  const Distance = process.env.NEXT_PUBLIC_APP_DISTANCE;
  const idCount: Record<string, number> = {};

  const customIcon = L.icon({
    iconUrl: '/images/location-sharp.png',
    iconSize: [25, 28],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const fetchStores = useCallback(async () => {
    try {
      const session = await getSession();
      const aToken = session?.user.aToken || '';
      const rToken = session?.user.rToken || '';

      const fetchedStores = await fetchStoresUtils(aToken, rToken, 'getCurrectLocatio1');
      setFilteredShops(fetchedStores || []);
      setStores(fetchedStores || []);
      setTeampstores(fetchedStores || []);
    } catch (error) {
      console.error("Error fetching stores:", error);
      setFilteredShops([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user.fname) {
      router.push("/sapp");
    }

    setAccessToken(session?.user?.aToken ?? '');
    setRefreshToken(session?.user?.rToken ?? '');
    fetchStores();
  }, [fetchStores, router, session?.user.fname]);

  const openNavigation = (lat: string, lng: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    setLoading(true);
    try {
      const query = e.target.value.toLowerCase();

      if (query === '') {
        await fetchStores();
        return;
      }

      const filtered = tempStores.filter((store: Shop) =>
        store.name.toLowerCase().includes(query)
      );

      setLoading(false);
      setStores(filtered);

    } catch (error) {
      console.error("Error in handleSearchChange:", error);
    }
  };

  const openonMap = (store: Shop) => {

    // const shop = filteredShops.filter((shop: Shop) => shop.id === shopID);
    const { lat, lon } = store.location;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, "_blank");
  }

  const handleIconclick = () => {
    router.push('/sapp/dashBoard');
  }

  const handleStoreClick = (store: Shop) => {
    let doorStatus=localStorage.getItem('door')|| '';

    if (Number(store.distanceInKm) <= Number(Distance)) {
      localStorage.setItem('storeID', store.id);
      router.push('');
    } else {
      openonMap(store)
    }
  }

  return (
    <div className="h-[100dvh] font-poppins bg-white text-black">
      <div className="flex flex-col px-7 h-1/2">
        <div className="flex items-center justify-between h-20">
          <ArrowLeftIcon className="h-10 w-10 text-buttonColor" onClick={handleIconclick} />
          <h1 className="text-black font-bold text-xl">Stores</h1>
          <UserIcon className="h-10 w-10 text-buttonColor" onClick={() => { router.push(`/sapp/settings`) }} />
        </div>
        <div className="flex-1 ">
          <MapContainer className="rounded-lg" center={[16.893746, 77.438584]} zoom={5} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {stores.map((store: Shop) => (
              <Marker key={store.id} position={[Number(store.location.lat), Number(store.location.lon)]} icon={customIcon} >
                <Popup>
                  <div style={{ textAlign: "center" }} className="flex flex-col items-center">
                    <Image src='/images/location-sharp.png' alt='' className='' width={1000} height={1000} />
                    <br />
                    <strong>{store.name}</strong>
                    <br />
                    <button
                      onClick={() => openNavigation(store.location.lat, store.location.lon)}
                      style={{
                        marginTop: "8px",
                        padding: "6px 12px",
                        border: "none",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Go to Store
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="h-1/2 p-5 z-3 relative">
        <div className="flex flex-col w-full gap-4 relative fixed z-2 h-[25%]">
          <div className="flex justify-between items-center">
            <strong className="text-xl font-bold">Select a store</strong>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                onChange={handleSearchChange}
                className="w-full font-semibold py-3 px-5 border-2 bg-white text-black border-buttonColor outline-none text-left rounded-full focus:ring-2 focus:ring-buttonColor transition-all"
              />
              <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-buttonColor" />
            </div>
          </div>
        </div>


        <div className="flex flex-col gap-3 z-1 overflow-y-scroll h-[70%] mt-5">
          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="loader border-t-4 border-buttonColor rounded-full w-12 h-12 animate-spin"></div>
            </div>
          ) : (
            stores.map((shop: Shop, index: number) => {
              return (
                <div key={index} onClick={() => { handleStoreClick(shop) }} className="bg-gray-100 rounded-lg px-4 py-2 flex justify-between items-center border-b mt-2">
                  <div className="flex gap-2 items-center">
                    <Image src='/images/location-sharp.png' alt='' className='h-5 w-4' width={1000} height={1000} />
                    <div className="flex flex-col">
                      <strong className="text-buttonColor text-lg font-semibold">{shop.name}</strong>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`rounded-md px-2 py-1 font-semibold text-white ${shop.status === "open" ? "bg-buttonColor" : "bg-yellow-500"
                        }`}
                    >
                      {shop.status === "open" ? "Open" : "Coming Soon"}
                    </span>
                    <span className="text-lg font-semibold">{shop.distance}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default StoresPage;