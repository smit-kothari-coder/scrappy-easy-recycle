create or replace function get_nearby_scrappers(
  user_lat double precision,
  user_lon double precision,
  radius_km double precision
)
returns table (
  id uuid,
  name text,
  phone text,
  vehicle_type text,
  availability_hours text,
  scrap_types text,
  rating double precision,
  distance_km double precision
)
language plpgsql
as $$
begin
  return query
  select
    s.id,
    s.name,
    s.phone,
    s.vehicle_type,
    s.availability_hours,
    s.scrap_types,
    s.rating,
    (point(s.longitude, s.latitude) <@> point(user_lon, user_lat)) * 1.609344 as distance_km
  from
    scrappers s
  where
    s.available = true
    and (point(s.longitude, s.latitude) <@> point(user_lon, user_lat)) * 1.609344 <= radius_km
  order by
    distance_km asc;
end;
$$; 