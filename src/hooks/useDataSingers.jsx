import { useEffect, useState } from "react";
 
const API_URL = "https://retoolapi.dev/f1D0Zs/dataGrupo2A";
 
const useDataSingers = () => {
const [activeTab, setActiveTab] = useState("list");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
 
  const [id, setId] = useState("");
  const [song, setSong] = useState("");
  const [singer, setSinger] = useState("");
  const [nacionality, setNacionality] = useState("");


  // Loads the records from the API and updates the list in state.
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
 
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("No se pudo obtener la información");
      }
 
      const data = await response.json();
      setData(data);
    } catch (fetchError) {
      setError(fetchError.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };
 
  // Fetch the data once when the hook is mounted.
  useEffect(() => {
    fetchData();
  }, []);
 
  // Clears the form fields and removes the current record id.
  const resetForm = () => {
    setId("");
    setSong("");
    setSinger("");
    setNacionality("");
  };
 
  // Opens the form in create mode with empty values.
  const openCreateForm = () => {
    resetForm();
    setMessage("");
    setActiveTab("form");
  };
 
  // Loads the selected record into the form so it can be edited.
  const handleEdit = (item) => {
    setId(item.id);
    setSong(item.cancion ?? "");
    setSinger(item.cantante ?? "");
    setNacionality(item.nacionalidad ?? "")
    setMessage("");
    setActiveTab("form");
  };
 
  // Submits the form to create a new record or update an existing one.
  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedSong = song.trim();
    const trimmedSinger = singer.trim();
    const trimmedNacionality = nacionality.trim();
 
    if (!trimmedSong) {
      setError("La canción es obligatoria");
      return;
    }

    if (!trimmedSinger) {
        setError("El cantante es obligatorio");
        return;
      }
 
    try {
      setSubmitting(true);
      setError("");
      setMessage("");
 
      const payload = {
        cancion: trimmedSong,
        cantante: trimmedSinger,
        nacionalidad: trimmedNacionality
      };
 
      const response = await fetch(id ? `${API_URL}/${id}` : API_URL, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
 
      if (!response.ok) {
        throw new Error(id ? "No se pudo actualizar" : "No se pudo crear");
      }
 
      setMessage(
        id
          ? "Registro actualizado correctamente"
          : "Registro creado correctamente",
      );
      resetForm();
      setActiveTab("list");
      await fetchData();
    } catch (submitError) {
      setError(submitError.message || "Error al guardar el registro");
    } finally {
      setSubmitting(false);
    }
  };
 
  // Deletes a record after confirmation and refreshes the list.
  const handleDelete = async (itemId) => {
    const shouldDelete =
      typeof window === "undefined"
        ? true
        : window.confirm("¿Deseas eliminar este registro?");
 
    if (!shouldDelete) {
      return;
    }
 
    try {
      setError("");
      setMessage("");
 
      const response = await fetch(`${API_URL}/${itemId}`, {
        method: "DELETE",
      });
 
      if (!response.ok) {
        throw new Error("No se pudo eliminar el registro");
      }
 
      setMessage("Registro eliminado correctamente");
      await fetchData();
 
      if (String(id) === String(itemId)) {
        resetForm();
        setActiveTab("list");
      }
    } catch (deleteError) {
      setError(deleteError.message || "Error al eliminar el registro");
    }
  };
 
  return {
    activeTab,
    setActiveTab,
    data,
    loading,
    submitting,
    error,
    message,
    id,
    song,
    setSong,
    singer,
    setSinger,
    nacionality,
    setNacionality,
    fetchData,
    openCreateForm,
    handleEdit,
    handleSubmit,
    handleDelete,
  };
};
 
export default useDataSingers;