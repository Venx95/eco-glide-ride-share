
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useRidesContext } from '@/providers/RidesProvider';
import BottomNavigation from '@/components/layout/BottomNavigation';
import RideCard from '@/components/rides/RideCard';

const formSchema = z.object({
  pickupPoint: z.string().min(2, "Please enter a pickup location"),
  destination: z.string().min(2, "Please enter a destination"),
  date: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const BookRide = () => {
  const navigate = useNavigate();
  const { searchRides } = useRidesContext();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickupPoint: '',
      destination: '',
      date: undefined,
    },
  });

  const onSubmit = (data: FormValues) => {
    const formattedDate = data.date ? format(data.date, 'yyyy-MM-dd') : '';
    const results = searchRides(data.pickupPoint, data.destination, formattedDate);
    setSearchResults(results);
    setSearched(true);
  };

  return (
    <div className="container mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="py-4"
      >
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle>Find a Ride</CardTitle>
            <CardDescription>
              Search for available rides based on your route and date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="pickupPoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Enter pickup location" 
                            {...field} 
                            className="pl-9"
                          />
                          <Search className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Enter destination" 
                            {...field} 
                            className="pl-9"
                          />
                          <Search className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="pl-3 text-left font-normal flex justify-between"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <Calendar className="h-4 w-4 ml-2" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Search Rides
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {searched && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-bold">
              {searchResults.length 
                ? `Found ${searchResults.length} available rides`
                : "No rides found for your search criteria"}
            </h2>
            
            {searchResults.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        )}
      </motion.div>

      <BottomNavigation />
    </div>
  );
};

export default BookRide;
